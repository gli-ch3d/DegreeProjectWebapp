import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Save, Send, X, AlertTriangle } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import DispatchTab from './components/DispatchTab';
import TimeTab from './components/TimeTab';
import ResponseTab from './components/ResponseTab';
import SceneTab from './components/SceneTab';
import { Badge } from './components/ui/badge';

export default function App() {
  const [activeTab, setActiveTab] = useState('dispatch');
  const [formData, setFormData] = useState({});
  const [disasterMode, setDisasterMode] = useState(false);

  const handleSave = () => {
    toast.success('ePCR saved successfully');
  };

  const handleSyncHospital = () => {
    toast.success('Syncing with hospital...');
  };

  const toggleDisasterMode = () => {
    setDisasterMode(!disasterMode);
    if (!disasterMode) {
      toast.warning('Disaster Mode Activated', {
        description: 'Simplified triage mode for mass casualty incidents'
      });
      setActiveTab('dispatch');
    } else {
      toast.success('Normal Mode Restored');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
          </div>
          
          {/* Logo */}
          <div className="flex-1 flex justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 4H20L24 8V24L20 28H8L4 24V8L8 4Z" fill="#4A5FBF"/>
              <path d="M12 4H24L28 8V20L24 24H12L8 20V8L12 4Z" fill="#E63946"/>
            </svg>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSyncHospital}>
              <Send className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDisasterMode}>
              <AlertTriangle className="h-4 w-4" />
            </Button>
            {disasterMode && <Badge variant="destructive">Disaster Mode</Badge>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full max-w-2xl mb-8 bg-white ${disasterMode ? 'grid-cols-3' : 'grid-cols-4'}`}>
            <TabsTrigger 
              value="dispatch" 
              className="data-[state=active]:bg-[#4A5FBF] data-[state=active]:text-white"
            >
              Dispatch
            </TabsTrigger>
            {!disasterMode && (
              <TabsTrigger 
                value="time"
                className="data-[state=active]:bg-[#4A5FBF] data-[state=active]:text-white"
              >
                Time
              </TabsTrigger>
            )}
            <TabsTrigger 
              value="response"
              className="data-[state=active]:bg-[#4A5FBF] data-[state=active]:text-white"
            >
              {disasterMode ? 'Patient' : 'Response'}
            </TabsTrigger>
            <TabsTrigger 
              value="scene"
              className="data-[state=active]:bg-[#4A5FBF] data-[state=active]:text-white"
            >
              Scene
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dispatch">
            <DispatchTab formData={formData} setFormData={setFormData} disasterMode={disasterMode} />
          </TabsContent>

          {!disasterMode && (
            <TabsContent value="time">
              <TimeTab formData={formData} setFormData={setFormData} />
            </TabsContent>
          )}

          <TabsContent value="response">
            <ResponseTab formData={formData} setFormData={setFormData} disasterMode={disasterMode} />
          </TabsContent>

          <TabsContent value="scene">
            <SceneTab formData={formData} setFormData={setFormData} disasterMode={disasterMode} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}