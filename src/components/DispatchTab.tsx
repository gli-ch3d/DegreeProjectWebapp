import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DispatchTabProps {
  formData: any;
  setFormData: (data: any) => void;
  disasterMode?: boolean;
}

export default function DispatchTab({ formData, setFormData, disasterMode = false }: DispatchTabProps) {
  if (disasterMode) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="mb-6 text-[#4A5FBF]">Quick Dispatch - Triage Mode</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="incidentNumber">Incident #</Label>
              <Input 
                id="incidentNumber" 
                placeholder="Auto-generated"
                value={formData.incidentNumber || `INC-${Date.now()}`}
                onChange={(e) => setFormData({...formData, incidentNumber: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="unitNumber">Unit</Label>
              <Input 
                id="unitNumber" 
                placeholder="Unit #"
                value={formData.unitNumber || ''}
                onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="address">Location</Label>
              <Input 
                id="address" 
                placeholder="Address"
                value={formData.address || ''}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority || ''}
                onValueChange={(value) => setFormData({...formData, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-6 text-[#4A5FBF]">Dispatch Information</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="incidentNumber">Incident Number</Label>
            <Input 
              id="incidentNumber" 
              placeholder="Auto-generated"
              value={formData.incidentNumber || `INC-${Date.now()}`}
              onChange={(e) => setFormData({...formData, incidentNumber: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="dispatchTime">Dispatch Time</Label>
            <Input 
              id="dispatchTime" 
              type="datetime-local"
              value={formData.dispatchTime || ''}
              onChange={(e) => setFormData({...formData, dispatchTime: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="callType">Call Type</Label>
            <Select 
              value={formData.callType || ''}
              onValueChange={(value) => setFormData({...formData, callType: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select call type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical">Medical Emergency</SelectItem>
                <SelectItem value="trauma">Trauma</SelectItem>
                <SelectItem value="cardiac">Cardiac Arrest</SelectItem>
                <SelectItem value="respiratory">Respiratory Distress</SelectItem>
                <SelectItem value="stroke">Stroke</SelectItem>
                <SelectItem value="psychiatric">Psychiatric</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select 
              value={formData.priority || ''}
              onValueChange={(value) => setFormData({...formData, priority: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emergency">Emergency (Code 3)</SelectItem>
                <SelectItem value="urgent">Urgent (Code 2)</SelectItem>
                <SelectItem value="routine">Routine (Code 1)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="address">Incident Address</Label>
            <Input 
              id="address" 
              placeholder="Enter incident location"
              value={formData.address || ''}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              placeholder="City"
              value={formData.city || ''}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="zip">ZIP Code</Label>
            <Input 
              id="zip" 
              placeholder="ZIP"
              value={formData.zip || ''}
              onChange={(e) => setFormData({...formData, zip: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="unitNumber">Unit Number</Label>
            <Input 
              id="unitNumber" 
              placeholder="e.g., Medic 101"
              value={formData.unitNumber || ''}
              onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="crewMembers">Crew Members</Label>
            <Input 
              id="crewMembers" 
              placeholder="Number of crew"
              type="number"
              min="1"
              value={formData.crewMembers || ''}
              onChange={(e) => setFormData({...formData, crewMembers: e.target.value})}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}