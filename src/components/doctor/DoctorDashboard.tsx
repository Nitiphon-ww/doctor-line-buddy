import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, Users, Clock, UserCheck, Settings, LogOut, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DoctorDashboardProps {
  user: any;
  onLogout: () => void;
}

export function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [queueList, setQueueList] = useState([
    { id: 1, name: "John Smith", queueNumber: 1, joinTime: "09:30 AM", status: "waiting" },
    { id: 2, name: "Sarah Johnson", queueNumber: 2, joinTime: "09:45 AM", status: "waiting" },
    { id: 3, name: "Mike Davis", queueNumber: 3, joinTime: "10:00 AM", status: "waiting" },
    { id: 4, name: "Emily Brown", queueNumber: 4, joinTime: "10:15 AM", status: "waiting" },
    { id: 5, name: "Robert Wilson", queueNumber: 5, joinTime: "10:30 AM", status: "waiting" }
  ]);
  
  const [consultationTime, setConsultationTime] = useState(15);
  const [currentPatient, setCurrentPatient] = useState<any>(null);
  const { toast } = useToast();

  const callNextPatient = () => {
    const nextPatient = queueList.find(p => p.status === "waiting");
    if (nextPatient) {
      setCurrentPatient(nextPatient);
      setQueueList(prev => prev.map(p => 
        p.id === nextPatient.id 
          ? { ...p, status: "called" }
          : p
      ));
      
      toast({
        title: "Patient Called",
        description: `${nextPatient.name} (Queue #${nextPatient.queueNumber}) has been called.`,
      });
    }
  };

  const completeConsultation = () => {
    if (currentPatient) {
      setQueueList(prev => prev.map(p => 
        p.id === currentPatient.id 
          ? { ...p, status: "completed" }
          : p
      ));
      setCurrentPatient(null);
      
      toast({
        title: "Consultation Completed",
        description: `${currentPatient.name}'s consultation has been marked as completed.`,
      });
    }
  };

  const getQueueStats = () => {
    const waiting = queueList.filter(p => p.status === "waiting").length;
    const completed = queueList.filter(p => p.status === "completed").length;
    const total = queueList.length;
    
    return { waiting, completed, total };
  };

  const stats = getQueueStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gradient-medical">Dr. {user.name}</h1>
              <p className="text-sm text-muted-foreground">Doctor Dashboard</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="medical-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">{stats.waiting}</h3>
                  <p className="text-sm text-muted-foreground">Waiting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="font-semibold text-lg">{stats.completed}</h3>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-secondary" />
                <div>
                  <h3 className="font-semibold text-lg">{consultationTime}m</h3>
                  <p className="text-sm text-muted-foreground">Avg. Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">{stats.total}</h3>
                  <p className="text-sm text-muted-foreground">Total Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Patient */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-accent" />
                Current Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentPatient ? (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">{currentPatient.name}</h3>
                    <Badge className="bg-accent text-accent-foreground">
                      Queue #{currentPatient.queueNumber}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Joined at {currentPatient.joinTime}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={completeConsultation}
                    className="w-full medical-button bg-accent hover:bg-accent/90"
                  >
                    Complete Consultation
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No patient currently being seen</p>
                  <Button 
                    onClick={callNextPatient}
                    className="mt-4 medical-button"
                    disabled={stats.waiting === 0}
                  >
                    Call Next Patient
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Queue Management */}
          <Card className="medical-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Patient Queue
                </CardTitle>
                <CardDescription>Manage patient appointments and queue order</CardDescription>
              </div>
              <Button onClick={callNextPatient} disabled={stats.waiting === 0}>
                Next Patient
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {queueList.map((patient) => (
                  <div 
                    key={patient.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {patient.queueNumber}
                      </div>
                      <div>
                        <h4 className="font-semibold">{patient.name}</h4>
                        <p className="text-sm text-muted-foreground">Joined at {patient.joinTime}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        patient.status === "completed" ? "secondary" :
                        patient.status === "called" ? "default" : "outline"
                      }
                      className={
                        patient.status === "completed" ? "bg-accent text-accent-foreground" :
                        patient.status === "called" ? "bg-primary text-primary-foreground" : ""
                      }
                    >
                      {patient.status === "completed" ? "Completed" :
                       patient.status === "called" ? "Called" : "Waiting"}
                    </Badge>
                  </div>
                ))}
                
                {queueList.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No patients in queue today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <Card className="medical-card max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-secondary" />
              Queue Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="consultation-time">Average Consultation Time (minutes)</Label>
              <Input
                id="consultation-time"
                type="number"
                value={consultationTime}
                onChange={(e) => setConsultationTime(Number(e.target.value))}
                min="5"
                max="60"
              />
              <p className="text-xs text-muted-foreground">
                This helps estimate waiting times for patients
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}