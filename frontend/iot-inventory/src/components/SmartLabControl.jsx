import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Lightbulb, Fan, Power, Clock, Zap, Activity } from 'lucide-react';
export function SmartLabControl() {
  const [devices, setDevices] = useState([{
    id: '1',
    name: 'Main Lab Lights',
    type: 'light',
    location: 'Main Lab Area',
    isOn: true,
    intensity: 80,
    lastToggled: '2024-11-27 08:30',
    powerUsage: 45
  }, {
    id: '2',
    name: 'Workbench Lights',
    type: 'light',
    location: 'Workbench Section',
    isOn: true,
    intensity: 100,
    lastToggled: '2024-11-27 08:30',
    powerUsage: 30
  }, {
    id: '3',
    name: 'Storage Area Lights',
    type: 'light',
    location: 'Storage Room',
    isOn: false,
    intensity: 0,
    lastToggled: '2024-11-26 18:00',
    powerUsage: 0
  }, {
    id: '4',
    name: 'Ceiling Fan 1',
    type: 'fan',
    location: 'Main Lab Area',
    isOn: true,
    intensity: 60,
    lastToggled: '2024-11-27 09:00',
    powerUsage: 25
  }, {
    id: '5',
    name: 'Ceiling Fan 2',
    type: 'fan',
    location: 'Meeting Corner',
    isOn: false,
    intensity: 0,
    lastToggled: '2024-11-26 17:30',
    powerUsage: 0
  }, {
    id: '6',
    name: 'Exhaust Fan',
    type: 'fan',
    location: 'Soldering Station',
    isOn: true,
    intensity: 100,
    lastToggled: '2024-11-27 10:15',
    powerUsage: 35
  }]);
  const [autoShutoffTime, setAutoShutoffTime] = useState('20:00');
  const toggleDevice = id => {
    setDevices(devices.map(device => {
      if (device.id === id) {
        const newIsOn = !device.isOn;
        return {
          ...device,
          isOn: newIsOn,
          intensity: newIsOn ? device.type === 'light' ? 80 : 60 : 0,
          powerUsage: newIsOn ? device.type === 'light' ? 30 : 25 : 0,
          lastToggled: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      }
      return device;
    }));
  };
  const updateIntensity = (id, value) => {
    setDevices(devices.map(device => {
      if (device.id === id) {
        const intensity = value;
        const powerUsage = device.isOn ? Math.round((device.type === 'light' ? 45 : 35) * (intensity / 100)) : 0;
        return {
          ...device,
          intensity,
          powerUsage
        };
      }
      return device;
    }));
  };
  const toggleAllDevices = (type, state) => {
    setDevices(devices.map(device => {
      if (device.type === type) {
        return {
          ...device,
          isOn: state,
          intensity: state ? type === 'light' ? 80 : 60 : 0,
          powerUsage: state ? type === 'light' ? 30 : 25 : 0,
          lastToggled: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      }
      return device;
    }));
  };
  const lights = devices.filter(d => d.type === 'light');
  const fans = devices.filter(d => d.type === 'fan');
  const activeLights = lights.filter(d => d.isOn).length;
  const activeFans = fans.filter(d => d.isOn).length;
  const totalPowerUsage = devices.reduce((sum, device) => sum + device.powerUsage, 0);
  return <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">Smart Lab Control</h2>
            <p className="text-gray-600">Remote control of lab lights and fans</p>
          </div>
          <Badge className="bg-green-500 gap-2 px-4 py-2">
            <Activity className="w-4 h-4" />
            All Devices Online
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Lights</p>
                  <p className="text-3xl text-gray-900">{activeLights}/{lights.length}</p>
                </div>
                <div className="bg-yellow-50 text-yellow-600 p-3 rounded-lg">
                  <Lightbulb className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Fans</p>
                  <p className="text-3xl text-gray-900">{activeFans}/{fans.length}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                  <Fan className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Power Usage</p>
                  <p className="text-3xl text-gray-900">{totalPowerUsage}W</p>
                </div>
                <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Auto Shutoff</p>
                  <p className="text-xl text-gray-900">{autoShutoffTime}</p>
                </div>
                <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Controls</CardTitle>
            <CardDescription>Control all devices of a type at once</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => toggleAllDevices('light', true)} className="gap-2">
                <Lightbulb className="w-4 h-4" />
                Turn On All Lights
              </Button>
              <Button onClick={() => toggleAllDevices('light', false)} variant="outline" className="gap-2">
                <Lightbulb className="w-4 h-4" />
                Turn Off All Lights
              </Button>
              <Button onClick={() => toggleAllDevices('fan', true)} className="gap-2">
                <Fan className="w-4 h-4" />
                Turn On All Fans
              </Button>
              <Button onClick={() => toggleAllDevices('fan', false)} variant="outline" className="gap-2">
                <Fan className="w-4 h-4" />
                Turn Off All Fans
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auto Shutoff Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Auto Shutoff Schedule</CardTitle>
            <CardDescription>Automatically turn off all devices at a specific time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label htmlFor="shutoff-time">Shutoff Time:</Label>
              <Select value={autoShutoffTime} onValueChange={setAutoShutoffTime}>
                <SelectTrigger id="shutoff-time" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                  <SelectItem value="19:00">7:00 PM</SelectItem>
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                  <SelectItem value="21:00">9:00 PM</SelectItem>
                  <SelectItem value="22:00">10:00 PM</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary">
                {autoShutoffTime !== 'disabled' ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lights Section */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Lighting Controls</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lights.map(device => <Card key={device.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${device.isOn ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle>{device.name}</CardTitle>
                      <CardDescription>{device.location}</CardDescription>
                    </div>
                  </div>
                  <Switch checked={device.isOn} onCheckedChange={() => toggleDevice(device.id)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Brightness</Label>
                      <span className="text-sm text-gray-600">{device.intensity}%</span>
                    </div>
                    <Slider value={[device.intensity || 0]} onValueChange={value => updateIntensity(device.id, value[0])} max={100} step={1} disabled={!device.isOn} className="w-full" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Power Usage:</span>
                    <span className="text-gray-900">{device.powerUsage}W</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Toggled:</span>
                    <span className="text-gray-900">{device.lastToggled}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={device.isOn ? 'default' : 'secondary'}>
                      <Power className="w-3 h-3 mr-1" />
                      {device.isOn ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>

      {/* Fans Section */}
      <div>
        <h3 className="text-gray-900 mb-4">Fan Controls</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {fans.map(device => <Card key={device.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${device.isOn ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Fan className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle>{device.name}</CardTitle>
                      <CardDescription>{device.location}</CardDescription>
                    </div>
                  </div>
                  <Switch checked={device.isOn} onCheckedChange={() => toggleDevice(device.id)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Speed</Label>
                      <span className="text-sm text-gray-600">{device.intensity}%</span>
                    </div>
                    <Slider value={[device.intensity || 0]} onValueChange={value => updateIntensity(device.id, value[0])} max={100} step={1} disabled={!device.isOn} className="w-full" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Power Usage:</span>
                    <span className="text-gray-900">{device.powerUsage}W</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Toggled:</span>
                    <span className="text-gray-900">{device.lastToggled}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={device.isOn ? 'default' : 'secondary'}>
                      <Power className="w-3 h-3 mr-1" />
                      {device.isOn ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </div>;
}