import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';

interface SceneTabProps {
  formData: any;
  setFormData: (data: any) => void;
  disasterMode?: boolean;
}

export default function SceneTab({ formData, setFormData, disasterMode = false }: SceneTabProps) {
  const updateEnvironmentalCondition = (condition: string, checked: boolean) => {
    const current = formData.environmentalConditions || [];
    if (checked) {
      setFormData({...formData, environmentalConditions: [...current, condition]});
    } else {
      setFormData({...formData, environmentalConditions: current.filter((c: string) => c !== condition)});
    }
  };

  if (disasterMode) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-6 text-[#4A5FBF]">Scene Info - Quick Entry</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sceneType">Scene Type</Label>
              <Select 
                value={formData.sceneType || ''}
                onValueChange={(value) => setFormData({...formData, sceneType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residence">Residence</SelectItem>
                  <SelectItem value="street">Street/Highway</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="public">Public Place</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sceneSafety">Scene Safe?</Label>
              <Select 
                value={formData.sceneSafety || ''}
                onValueChange={(value) => setFormData({...formData, sceneSafety: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Safety" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safe">Safe</SelectItem>
                  <SelectItem value="unsafe">Unsafe</SelectItem>
                  <SelectItem value="potential-hazards">Potential Hazards</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="sceneNotes">Scene Notes</Label>
              <Textarea 
                id="sceneNotes" 
                placeholder="Brief scene description, hazards, or other relevant info..."
                value={formData.sceneNotes || ''}
                onChange={(e) => setFormData({...formData, sceneNotes: e.target.value})}
                rows={3}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scene Safety */}
      <Card className="p-6">
        <h2 className="mb-6 text-[#4A5FBF]">Scene Safety & Assessment</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="sceneType">Scene Type</Label>
            <Select 
              value={formData.sceneType || ''}
              onValueChange={(value) => setFormData({...formData, sceneType: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scene type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residence">Residence</SelectItem>
                <SelectItem value="street">Street/Highway</SelectItem>
                <SelectItem value="commercial">Commercial Building</SelectItem>
                <SelectItem value="industrial">Industrial Site</SelectItem>
                <SelectItem value="public">Public Place</SelectItem>
                <SelectItem value="recreational">Recreational Area</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sceneSafety">Scene Safety Status</Label>
            <Select 
              value={formData.sceneSafety || ''}
              onValueChange={(value) => setFormData({...formData, sceneSafety: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select safety status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="potentially-unsafe">Potentially Unsafe</SelectItem>
                <SelectItem value="unsafe">Unsafe - Staged</SelectItem>
                <SelectItem value="law-enforcement">Law Enforcement Required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="numberOfPatients">Number of Patients</Label>
            <Input 
              id="numberOfPatients" 
              type="number"
              min="0"
              placeholder="1"
              value={formData.numberOfPatients || ''}
              onChange={(e) => setFormData({...formData, numberOfPatients: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="additionalResources">Additional Resources Called</Label>
            <Select 
              value={formData.additionalResources || ''}
              onValueChange={(value) => setFormData({...formData, additionalResources: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="additional-ems">Additional EMS</SelectItem>
                <SelectItem value="fire">Fire Department</SelectItem>
                <SelectItem value="police">Law Enforcement</SelectItem>
                <SelectItem value="hazmat">HAZMAT Team</SelectItem>
                <SelectItem value="rescue">Technical Rescue</SelectItem>
                <SelectItem value="air">Air Ambulance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Environmental Conditions */}
      <Card className="p-6">
        <h2 className="mb-6 text-[#4A5FBF]">Environmental Conditions</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="weather">Weather Conditions</Label>
            <Select 
              value={formData.weather || ''}
              onValueChange={(value) => setFormData({...formData, weather: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select weather" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clear">Clear</SelectItem>
                <SelectItem value="cloudy">Cloudy</SelectItem>
                <SelectItem value="rain">Rain</SelectItem>
                <SelectItem value="snow">Snow</SelectItem>
                <SelectItem value="fog">Fog</SelectItem>
                <SelectItem value="ice">Ice/Sleet</SelectItem>
                <SelectItem value="wind">High Winds</SelectItem>
                <SelectItem value="storm">Severe Weather</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="temperature">Ambient Temperature (°F)</Label>
            <Input 
              id="temperature" 
              type="number"
              placeholder="70"
              value={formData.temperature || ''}
              onChange={(e) => setFormData({...formData, temperature: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="lighting">Lighting Conditions</Label>
            <Select 
              value={formData.lighting || ''}
              onValueChange={(value) => setFormData({...formData, lighting: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lighting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daylight">Daylight</SelectItem>
                <SelectItem value="dusk">Dusk/Dawn</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="artificial">Artificial Light</SelectItem>
                <SelectItem value="poor">Poor Visibility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="roadConditions">Road/Surface Conditions</Label>
            <Select 
              value={formData.roadConditions || ''}
              onValueChange={(value) => setFormData({...formData, roadConditions: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dry">Dry</SelectItem>
                <SelectItem value="wet">Wet</SelectItem>
                <SelectItem value="icy">Icy</SelectItem>
                <SelectItem value="snowy">Snowy</SelectItem>
                <SelectItem value="muddy">Muddy</SelectItem>
                <SelectItem value="uneven">Uneven Terrain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="mb-3 block">Hazards Present (Select all that apply)</Label>
          <div className="grid grid-cols-2 gap-4">
            {[
              'Traffic Hazard',
              'Fire/Smoke',
              'Electrical Hazard',
              'Chemical/HAZMAT',
              'Structural Instability',
              'Violence/Aggression',
              'Animals',
              'Confined Space',
              'Height/Fall Risk',
              'Water/Drowning Risk',
              'Extreme Temperature',
              'Biological Hazard'
            ].map((hazard) => (
              <div key={hazard} className="flex items-center space-x-2">
                <Checkbox 
                  id={hazard}
                  checked={(formData.environmentalConditions || []).includes(hazard)}
                  onCheckedChange={(checked) => updateEnvironmentalCondition(hazard, checked as boolean)}
                />
                <label
                  htmlFor={hazard}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {hazard}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Mechanism of Injury / Nature of Illness */}
      <Card className="p-6">
        <h2 className="mb-6 text-[#4A5FBF]">Mechanism of Injury / Nature of Illness</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="injuryType">Injury/Illness Type</Label>
            <Select 
              value={formData.injuryType || ''}
              onValueChange={(value) => setFormData({...formData, injuryType: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="trauma">Trauma</SelectItem>
                <SelectItem value="both">Both Medical and Trauma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mechanism">Mechanism/Cause</Label>
            <Select 
              value={formData.mechanism || ''}
              onValueChange={(value) => setFormData({...formData, mechanism: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mechanism" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mva">Motor Vehicle Accident</SelectItem>
                <SelectItem value="fall">Fall</SelectItem>
                <SelectItem value="assault">Assault</SelectItem>
                <SelectItem value="gsw">Gunshot Wound</SelectItem>
                <SelectItem value="stabbing">Stabbing/Penetrating</SelectItem>
                <SelectItem value="burn">Burn</SelectItem>
                <SelectItem value="sports">Sports Injury</SelectItem>
                <SelectItem value="work">Work-Related</SelectItem>
                <SelectItem value="medical">Medical Emergency</SelectItem>
                <SelectItem value="overdose">Overdose/Poisoning</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="mechanismDetails">Mechanism/Nature Details</Label>
            <Textarea 
              id="mechanismDetails" 
              placeholder="Detailed description of mechanism of injury or nature of illness..."
              value={formData.mechanismDetails || ''}
              onChange={(e) => setFormData({...formData, mechanismDetails: e.target.value})}
              rows={4}
            />
          </div>
        </div>
      </Card>

      {/* Bystander Information */}
      <Card className="p-6">
        <h2 className="mb-6 text-[#4A5FBF]">Witness/Bystander Information</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bystanderCPR">Bystander CPR Performed</Label>
            <Select 
              value={formData.bystanderCPR || ''}
              onValueChange={(value) => setFormData({...formData, bystanderCPR: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
                <SelectItem value="not-applicable">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="aedUsed">AED Used Before Arrival</Label>
            <Select 
              value={formData.aedUsed || ''}
              onValueChange={(value) => setFormData({...formData, aedUsed: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
                <SelectItem value="not-applicable">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="witnessNotes">Witness/Bystander Notes</Label>
            <Textarea 
              id="witnessNotes" 
              placeholder="Information provided by witnesses or bystanders..."
              value={formData.witnessNotes || ''}
              onChange={(e) => setFormData({...formData, witnessNotes: e.target.value})}
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Scene Notes */}
      <Card className="p-6">
        <h2 className="mb-6 text-[#4A5FBF]">Additional Scene Notes</h2>
        
        <div>
          <Label htmlFor="sceneNotes">Scene Description & Notes</Label>
          <Textarea 
            id="sceneNotes" 
            placeholder="Additional observations about the scene, access difficulties, special considerations, etc..."
            value={formData.sceneNotes || ''}
            onChange={(e) => setFormData({...formData, sceneNotes: e.target.value})}
            rows={6}
          />
        </div>
      </Card>
    </div>
  );
}