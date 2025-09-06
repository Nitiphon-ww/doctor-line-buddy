import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Bell, Calendar, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatientDashboardProps {
  user: any;
  onLogout: () => void;
}

export function PatientDashboard({ user, onLogout }: PatientDashboardProps) {
  const [queueData, setQueueData] = useState({
    isInQueue: false,
    queueNumber: null,
    patientsAhead: 0,
    estimatedWaitTime: 0,
    status: 'waiting' // waiting, called, completed
  });
  
  const { toast } = useToast();

  // Mock queue simulation
  useEffect(() => {
    if (queueData.isInQueue && queueData.patientsAhead > 0) {
      const interval = setInterval(() => {
        setQueueData(prev => ({
          ...prev,
          patientsAhead: Math.max(0, prev.patientsAhead - 1),
          estimatedWaitTime: Math.max(0, prev.estimatedWaitTime - 15)
        }));
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [queueData.isInQueue, queueData.patientsAhead]);

  // Mock notification when called
  useEffect(() => {
    if (queueData.isInQueue && queueData.patientsAhead === 0) {
      toast({
        title: "You're Next!",
        description: "The doctor is ready to see you now. Please proceed to the consultation room.",
      });
      setQueueData(prev => ({ ...prev, status: 'called' }));
    }
  }, [queueData.patientsAhead, queueData.isInQueue, toast]);

  const joinQueue = () => {
    const queueNumber = Math.floor(Math.random() * 50) + 1;
    const patientsAhead = Math.floor(Math.random() * 8) + 1;
    
    setQueueData({
      isInQueue: true,
      queueNumber,
      patientsAhead,
      estimatedWaitTime: patientsAhead * 15,
      status: 'waiting'
    });

    toast({
      title: "Queue Booking Confirmed",
      description: `You are now in the queue. Your number is ${queueNumber}.`,
    });
  };

  const leaveQueue = () => {
    setQueueData({
      isInQueue: false,
      queueNumber: null,
      patientsAhead: 0,
      estimatedWaitTime: 0,
      status: 'waiting'
    });

    toast({
      title: "Left Queue",
      description: "You have successfully left the queue.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gradient-medical">Welcome, {user.name}</h1>
              <p className="text-sm text-muted-foreground">Patient Dashboard</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {!queueData.isInQueue ? (
          // Not in queue - show booking options
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="medical-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gradient-medical">Book Your Appointment</CardTitle>
                <CardDescription>Join the doctor's queue and get real-time updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Clock className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Quick Service</h3>
                      <p className="text-sm text-muted-foreground">Average 15 min per patient</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Bell className="w-8 h-8 text-accent" />
                    <div>
                      <h3 className="font-semibold">Real-time Updates</h3>
                      <p className="text-sm text-muted-foreground">Get notified when it's your turn</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Calendar className="w-8 h-8 text-secondary" />
                    <div>
                      <h3 className="font-semibold">Today's Queue</h3>
                      <p className="text-sm text-muted-foreground">Available now</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={joinQueue}
                  className="w-full medical-button text-lg py-6"
                  size="lg"
                >
                  Join Queue Now
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // In queue - show status
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="medical-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">You're in the Queue!</CardTitle>
                <CardDescription>Your appointment status and real-time updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="queue-number pulse-medical">#{queueData.queueNumber}</div>
                    <Badge 
                      className={`mt-2 ${
                        queueData.status === 'called' 
                          ? 'bg-accent text-accent-foreground' 
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {queueData.status === 'called' ? 'You\'re Next!' : 'In Queue'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">{queueData.patientsAhead}</h3>
                        <p className="text-sm text-muted-foreground">Patients ahead</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-secondary" />
                      <div>
                        <h3 className="font-semibold text-lg">{queueData.estimatedWaitTime} min</h3>
                        <p className="text-sm text-muted-foreground">Estimated wait</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {queueData.status === 'called' && (
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                    <div className="flex items-center gap-2 text-accent font-semibold">
                      <Bell className="w-5 h-5" />
                      Doctor is ready to see you!
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please proceed to the consultation room.
                    </p>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  onClick={leaveQueue}
                  className="w-full"
                >
                  Leave Queue
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}