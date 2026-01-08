import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Hospital, Printer, RotateCcw, Mic, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import ICD11Search from './ICD11Search';
import VitalsChart from './VitalsChart';
import Barcode from 'react-barcode';
import { useEffect, useState } from 'react';

interface ResponseTabProps {
  formData: any;
  setFormData: (data: any) => void;
  disasterMode?: boolean;
}

export default function ResponseTab({ formData, setFormData, disasterMode = false }: ResponseTabProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFor, setRecordingFor] = useState<'complaint' | 'narrative' | null>(null);

  // Generate unique patient ID if not exists
  useEffect(() => {
    if (!formData.patientId) {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const patientId = `PT${timestamp}${random}`;
      setFormData({ ...formData, patientId });
    }
  }, []);

  const handleHospitalSync = () => {
    toast.success('Syncing patient data with receiving hospital...', {
      description: 'Hospital will receive real-time updates'
    });
  };

  const handlePrintBarcode = () => {
    const printWindow = window.open('', '', 'width=400,height=300');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Patient ID Barcode</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .barcode-container {
                text-align: center;
                padding: 20px;
                border: 2px solid #000;
              }
              .patient-info {
                margin-bottom: 10px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              <div class="patient-info">Patient ID: ${formData.patientId || 'N/A'}</div>
              <div class="patient-info">${formData.patientName || 'Unknown Patient'}</div>
              <div id="barcode"></div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
            <script>
              JsBarcode("#barcode", "${formData.patientId || 'PT000000000000000'}", {
                format: "CODE128",
                width: 2,
                height: 60,
                displayValue: true
              });
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
    toast.success('Preparing barcode tag for printing...');
  };

  const handleClearPatient = () => {
    // Generate new patient ID
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const newPatientId = `PT${timestamp}${random}`;
    
    // Clear all patient-specific fields while preserving incident info
    const clearedData = {
      ...formData,
      // Generate new patient ID
      patientId: newPatientId,
      // Clear patient info
      patientName: '',
      age: '',
      dob: '',
      gender: '',
      weight: '',
      height: '',
      triageLevel: '',
      // Clear vitals
      bp: '',
      pulse: '',
      resp: '',
      temp: '',
      spo2: '',
      bloodGlucose: '',
      gcs: '',
      painScale: '',
      // Clear complaint and narrative
      chiefComplaint: '',
      narrative: '',
      icd10Code: [],
      // Clear transport info for new patient
      transportType: '',
      destination: '',
      patientDisposition: '',
    };
    
    setFormData(clearedData);
    toast.success('New patient form ready', {
      description: `Patient ID: ${newPatientId}`
    });
  };

  const handleVoiceMemo = (field: 'complaint' | 'narrative') => {
    if (isRecording && recordingFor === field) {
      // Stop recording
      setIsRecording(false);
      setRecordingFor(null);
      toast.success('Voice memo saved', {
        description: 'Recording has been transcribed'
      });
      // In production, this would use Web Speech API or similar
      const mockTranscription = field === 'complaint' 
        ? 'Patient complains of chest pain radiating to left arm, difficulty breathing'
        : 'Patient found conscious and alert. Administered oxygen at 15 LPM via non-rebreather mask. IV established in left AC. Vitals monitored continuously during transport.';
      
      if (field === 'complaint') {
        setFormData({...formData, chiefComplaint: (formData.chiefComplaint || '') + ' ' + mockTranscription});
      } else {
        setFormData({...formData, narrative: (formData.narrative || '') + ' ' + mockTranscription});
      }
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingFor(field);
      toast.info('Recording voice memo...', {
        description: 'Speak clearly into the microphone'
      });
    }
  };

  const handleAICodeGeneration = () => {
    const complaint = formData.chiefComplaint || '';
    if (!complaint.trim()) {
      toast.error('No complaint text found', {
        description: 'Please enter a chief complaint first'
      });
      return;
    }

    toast.loading('Analyzing complaint with AI...', { duration: 1500 });
    
    // Mock AI analysis - in production would use actual AI/NLP
    setTimeout(() => {
      const suggestedCodes: string[] = [];
      const lowerComplaint = complaint.toLowerCase();
      
      // Collect all applicable codes
      if (lowerComplaint.includes('chest pain') || lowerComplaint.includes('cardiac')) {
        suggestedCodes.push('MD11.9'); // Chest pain, unspecified
      }
      if (lowerComplaint.includes('stroke') || lowerComplaint.includes('facial droop')) {
        suggestedCodes.push('8B11.1'); // Ischaemic stroke
      }
      if (lowerComplaint.includes('breath') || lowerComplaint.includes('dyspnea') || lowerComplaint.includes('shortness')) {
        suggestedCodes.push('MD11.1'); // Dyspnoea
      }
      if (lowerComplaint.includes('fall') || lowerComplaint.includes('fell')) {
        suggestedCodes.push('NC50'); // Fall from unspecified height
      }
      if (lowerComplaint.includes('mva') || lowerComplaint.includes('motor vehicle') || lowerComplaint.includes('accident')) {
        suggestedCodes.push('NI20.0'); // Injury in motor vehicle traffic accident
      }
      if (lowerComplaint.includes('head') || lowerComplaint.includes('concussion')) {
        suggestedCodes.push('NA00'); // Head injury
      }
      if (lowerComplaint.includes('burn')) {
        suggestedCodes.push('ND60'); // Burn of unspecified body region
      }
      if (lowerComplaint.includes('overdose') || lowerComplaint.includes('poisoning')) {
        suggestedCodes.push('NE10.0'); // Poisoning by opioids
      }
      if (lowerComplaint.includes('nausea')) {
        suggestedCodes.push('MD40.0'); // Nausea
      }
      if (lowerComplaint.includes('vomit')) {
        suggestedCodes.push('MD40.1'); // Vomiting
      }
      if (lowerComplaint.includes('pain') && lowerComplaint.includes('abdomen')) {
        suggestedCodes.push('MD30.0'); // Abdominal pain
      }
      
      // If no specific codes matched, add generic injury code
      if (suggestedCodes.length === 0) {
        suggestedCodes.push('NB00'); // Injury to unspecified body region
      }
      
      // Merge with existing codes, avoiding duplicates
      const currentCodes = formData.icd10Code || [];
      const updatedCodes = [...new Set([...currentCodes, ...suggestedCodes])];
      
      setFormData({...formData, icd10Code: updatedCodes});
      toast.success('ICD-11 codes suggested', {
        description: `Added ${suggestedCodes.length} code${suggestedCodes.length > 1 ? 's' : ''} based on complaint analysis`
      });
    }, 1500);
  };

  if (disasterMode) {
    return (
      <div className="space-y-6">
        {/* Patient Information - Simplified */}
        <Card className="p-6 relative">
          {/* Barcode in upper right corner */}
          <div className="absolute top-4 right-4 flex items-start gap-2">
            <Button 
              size="icon"
              variant="outline"
              onClick={handlePrintBarcode}
              className="h-8 w-8 shrink-0"
              title="Print Barcode Tag"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <div className="bg-white p-2 rounded border border-gray-200">
              <Barcode 
                value={formData.patientId || 'PT000000000000000'} 
                width={1}
                height={40}
                fontSize={10}
                displayValue={true}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-[#4A5FBF]">Quick Patient Info</h2>
            <Button 
              size="icon"
              variant="outline"
              onClick={handleClearPatient}
              className="h-7 w-7"
              title="Clear and Start New Patient"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="patientName">Name</Label>
              <Input 
                id="patientName" 
                placeholder="Last, First"
                value={formData.patientName || ''}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number"
                placeholder="Age"
                value={formData.age || ''}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={formData.gender || ''}
                onValueChange={(value) => setFormData({...formData, gender: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">M</SelectItem>
                  <SelectItem value="female">F</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="triageLevel">Triage Level</Label>
              <Select 
                value={formData.triageLevel || ''}
                onValueChange={(value) => setFormData({...formData, triageLevel: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Triage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate (Red)</SelectItem>
                  <SelectItem value="delayed">Delayed (Yellow)</SelectItem>
                  <SelectItem value="minor">Minor (Green)</SelectItem>
                  <SelectItem value="deceased">Deceased (Black)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Vital Signs - Simplified */}
        <Card className="p-6">
          <h2 className="mb-6 text-[#4A5FBF]">Quick Vitals</h2>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label htmlFor="bp">BP</Label>
              <Input 
                id="bp" 
                placeholder="120/80"
                value={formData.bp || ''}
                onChange={(e) => setFormData({...formData, bp: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="pulse">Pulse</Label>
              <Input 
                id="pulse" 
                type="number"
                placeholder="80"
                value={formData.pulse || ''}
                onChange={(e) => setFormData({...formData, pulse: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="resp">Resp</Label>
              <Input 
                id="resp" 
                type="number"
                placeholder="16"
                value={formData.resp || ''}
                onChange={(e) => setFormData({...formData, resp: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="gcs">GCS</Label>
              <Input 
                id="gcs" 
                type="number"
                min="3"
                max="15"
                placeholder="15"
                value={formData.gcs || ''}
                onChange={(e) => setFormData({...formData, gcs: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="spo2">SpO2</Label>
              <Input 
                id="spo2" 
                type="number"
                placeholder="98"
                value={formData.spo2 || ''}
                onChange={(e) => setFormData({...formData, spo2: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="painScale">Pain</Label>
              <Input 
                id="painScale" 
                type="number"
                min="0"
                max="10"
                placeholder="0-10"
                value={formData.painScale || ''}
                onChange={(e) => setFormData({...formData, painScale: e.target.value})}
              />
            </div>
          </div>
        </Card>

        {/* Chief Complaint - Simplified */}
        <Card className="p-6">
          <h2 className="mb-6 text-[#4A5FBF]">Injuries / Complaint</h2>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="chiefComplaint">Brief Description</Label>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant={isRecording && recordingFor === 'complaint' ? 'destructive' : 'outline'}
                  onClick={() => handleVoiceMemo('complaint')}
                  className="gap-2"
                  title="Record Voice Memo"
                >
                  <Mic className={`h-4 w-4 ${isRecording && recordingFor === 'complaint' ? 'animate-pulse' : ''}`} />
                  {isRecording && recordingFor === 'complaint' ? 'Recording' : 'Voice'}
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={handleAICodeGeneration}
                  className="gap-2"
                  title="Generate ICD-11 Code with AI"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Code
                </Button>
              </div>
            </div>
            <Textarea 
              id="chiefComplaint" 
              placeholder="Quick description of injuries or chief complaint..."
              value={formData.chiefComplaint || ''}
              onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
              rows={3}
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hospital Sync */}
      <Card className="p-6 bg-[#4A5FBF] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3>Hospital Sync</h3>
            <p className="text-sm opacity-90">Send patient data to receiving facility</p>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleHospitalSync}
            className="gap-2"
          >
            <Hospital className="h-4 w-4" />
            Sync with Hospital
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vitals Chart */}
        <div className="lg:col-span-1">
          <VitalsChart />
        </div>

        {/* Patient Information */}
        <div className="lg:col-span-2">
          <Card className="p-6 relative">
            {/* Barcode in upper right corner */}
            <div className="absolute top-4 right-4 flex items-start gap-2">
              <Button 
                size="icon"
                variant="outline"
                onClick={handlePrintBarcode}
                className="h-8 w-8 shrink-0"
                title="Print Barcode Tag"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <div className="bg-white p-2 rounded border border-gray-200">
                <Barcode 
                  value={formData.patientId || 'PT000000000000000'} 
                  width={1}
                  height={40}
                  fontSize={10}
                  displayValue={true}
                />
              </div>
            </div>
            
            <h2 className="mb-6 text-[#4A5FBF]">Patient Information</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input 
                  id="patientName" 
                  placeholder="Last, First"
                  value={formData.patientName || ''}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input 
                  id="dob" 
                  type="date"
                  value={formData.dob || ''}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number"
                  placeholder="Auto-calculated"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender || ''}
                  onValueChange={(value) => setFormData({...formData, gender: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight" 
                  type="number"
                  placeholder="Weight"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height" 
                  type="number"
                  placeholder="Height"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Transport Type */}
      <Card className="p-6">
        <h2 className="mb-6 text-[#4A5FBF]">Transport Information</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="transportType">Transport Type</Label>
            <Select 
              value={formData.transportType || ''}
              onValueChange={(value) => setFormData({...formData, transportType: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transport type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ground">Ground Transport</SelectItem>
                <SelectItem value="air">Air Transport</SelectItem>
                <SelectItem value="non-transport">Non-Transport Rescue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="destination">Destination Facility</Label>
            <Select 
              value={formData.destination || ''}
              onValueChange={(value) => setFormData({...formData, destination: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select facility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Hospital</SelectItem>
                <SelectItem value="trauma">Trauma Center</SelectItem>
                <SelectItem value="cardiac">Cardiac Center</SelectItem>
                <SelectItem value="stroke">Stroke Center</SelectItem>
                <SelectItem value="pediatric">Pediatric Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="patientDisposition">Patient Disposition</Label>
            <Select 
              value={formData.patientDisposition || ''}
              onValueChange={(value) => setFormData({...formData, patientDisposition: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select disposition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="treated-transported">Treated and Transported</SelectItem>
                <SelectItem value="treated-released">Treated and Released</SelectItem>
                <SelectItem value="refused">Refused Care</SelectItem>
                <SelectItem value="deceased">Deceased</SelectItem>
                <SelectItem value="no-patient">No Patient Found</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="crewLevel">Crew Level of Care</Label>
            <Select 
              value={formData.crewLevel || ''}
              onValueChange={(value) => setFormData({...formData, crewLevel: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bls">BLS (Basic Life Support)</SelectItem>
                <SelectItem value="als">ALS (Advanced Life Support)</SelectItem>
                <SelectItem value="critical-care">Critical Care</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Chief Complaint and ICD-10 */}
      <Card className="p-6">
        <h2 className="mb-6 text-[#4A5FBF]">Chief Complaint & Diagnosis</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="chiefComplaint">Chief Complaint</Label>
              <Button 
                size="sm"
                variant={isRecording && recordingFor === 'complaint' ? 'destructive' : 'outline'}
                onClick={() => handleVoiceMemo('complaint')}
                className="gap-2"
                title="Record Voice Memo"
              >
                <Mic className={`h-4 w-4 ${isRecording && recordingFor === 'complaint' ? 'animate-pulse' : ''}`} />
                {isRecording && recordingFor === 'complaint' ? 'Recording...' : 'Voice Memo'}
              </Button>
            </div>
            <Textarea 
              id="chiefComplaint" 
              placeholder="Describe the primary complaint..."
              value={formData.chiefComplaint || ''}
              onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>ICD-11 Code Search</Label>
              <Button 
                size="sm"
                variant="outline"
                onClick={handleAICodeGeneration}
                className="gap-2"
                title="Generate ICD-11 Code with AI"
              >
                <Sparkles className="h-4 w-4" />
                AI Generate Code
              </Button>
            </div>
            <ICD11Search 
              values={formData.icd10Code || []}
              onChange={(codes) => setFormData({...formData, icd10Code: codes})}
              onRemove={(code) => {
                const updatedCodes = (formData.icd10Code || []).filter((c: string) => c !== code);
                setFormData({...formData, icd10Code: updatedCodes});
              }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="narrative">Patient Care Narrative</Label>
              <Button 
                size="sm"
                variant={isRecording && recordingFor === 'narrative' ? 'destructive' : 'outline'}
                onClick={() => handleVoiceMemo('narrative')}
                className="gap-2"
                title="Record Voice Memo"
              >
                <Mic className={`h-4 w-4 ${isRecording && recordingFor === 'narrative' ? 'animate-pulse' : ''}`} />
                {isRecording && recordingFor === 'narrative' ? 'Recording...' : 'Voice Memo'}
              </Button>
            </div>
            <Textarea 
              id="narrative" 
              placeholder="Detailed narrative of patient assessment and care provided..."
              value={formData.narrative || ''}
              onChange={(e) => setFormData({...formData, narrative: e.target.value})}
              rows={6}
            />
          </div>
        </div>
      </Card>

      {/* Vital Signs */}
      <Card className="p-6">
        <h2 className="mb-6 text-[#4A5FBF]">Vital Signs</h2>
        
        <div className="grid grid-cols-4 gap-6">
          <div>
            <Label htmlFor="bp">Blood Pressure</Label>
            <Input 
              id="bp" 
              placeholder="120/80"
              value={formData.bp || ''}
              onChange={(e) => setFormData({...formData, bp: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="pulse">Pulse (bpm)</Label>
            <Input 
              id="pulse" 
              type="number"
              placeholder="80"
              value={formData.pulse || ''}
              onChange={(e) => setFormData({...formData, pulse: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="resp">Respirations</Label>
            <Input 
              id="resp" 
              type="number"
              placeholder="16"
              value={formData.resp || ''}
              onChange={(e) => setFormData({...formData, resp: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="temp">Temperature (°F)</Label>
            <Input 
              id="temp" 
              type="number"
              step="0.1"
              placeholder="98.6"
              value={formData.temp || ''}
              onChange={(e) => setFormData({...formData, temp: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="spo2">SpO2 (%)</Label>
            <Input 
              id="spo2" 
              type="number"
              placeholder="98"
              value={formData.spo2 || ''}
              onChange={(e) => setFormData({...formData, spo2: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="bloodGlucose">Blood Glucose</Label>
            <Input 
              id="bloodGlucose" 
              type="number"
              placeholder="100"
              value={formData.bloodGlucose || ''}
              onChange={(e) => setFormData({...formData, bloodGlucose: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="gcs">GCS Score</Label>
            <Input 
              id="gcs" 
              type="number"
              min="3"
              max="15"
              placeholder="15"
              value={formData.gcs || ''}
              onChange={(e) => setFormData({...formData, gcs: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="painScale">Pain Scale (0-10)</Label>
            <Input 
              id="painScale" 
              type="number"
              min="0"
              max="10"
              placeholder="0"
              value={formData.painScale || ''}
              onChange={(e) => setFormData({...formData, painScale: e.target.value})}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}