import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Clock } from 'lucide-react';

interface TimeTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function TimeTab({ formData, setFormData }: TimeTabProps) {
  const setCurrentTime = (field: string) => {
    const now = new Date();
    const timeString = now.toISOString().slice(0, 16);
    setFormData({...formData, [field]: timeString});
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-6 text-[#4A5FBF]">Time Log</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="dispatchNotified">Dispatch Notified</Label>
            <div className="flex gap-2">
              <Input 
                id="dispatchNotified" 
                type="datetime-local"
                value={formData.dispatchNotified || ''}
                onChange={(e) => setFormData({...formData, dispatchNotified: e.target.value})}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentTime('dispatchNotified')}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="enRoute">En Route</Label>
            <div className="flex gap-2">
              <Input 
                id="enRoute" 
                type="datetime-local"
                value={formData.enRoute || ''}
                onChange={(e) => setFormData({...formData, enRoute: e.target.value})}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentTime('enRoute')}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="atScene">At Scene</Label>
            <div className="flex gap-2">
              <Input 
                id="atScene" 
                type="datetime-local"
                value={formData.atScene || ''}
                onChange={(e) => setFormData({...formData, atScene: e.target.value})}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentTime('atScene')}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="patientContact">Patient Contact</Label>
            <div className="flex gap-2">
              <Input 
                id="patientContact" 
                type="datetime-local"
                value={formData.patientContact || ''}
                onChange={(e) => setFormData({...formData, patientContact: e.target.value})}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentTime('patientContact')}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="departScene">Depart Scene</Label>
            <div className="flex gap-2">
              <Input 
                id="departScene" 
                type="datetime-local"
                value={formData.departScene || ''}
                onChange={(e) => setFormData({...formData, departScene: e.target.value})}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentTime('departScene')}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="atDestination">At Destination</Label>
            <div className="flex gap-2">
              <Input 
                id="atDestination" 
                type="datetime-local"
                value={formData.atDestination || ''}
                onChange={(e) => setFormData({...formData, atDestination: e.target.value})}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentTime('atDestination')}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="transferCare">Transfer of Care</Label>
            <div className="flex gap-2">
              <Input 
                id="transferCare" 
                type="datetime-local"
                value={formData.transferCare || ''}
                onChange={(e) => setFormData({...formData, transferCare: e.target.value})}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentTime('transferCare')}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="inService">Back In Service</Label>
            <div className="flex gap-2">
              <Input 
                id="inService" 
                type="datetime-local"
                value={formData.inService || ''}
                onChange={(e) => setFormData({...formData, inService: e.target.value})}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentTime('inService')}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
