import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BubbleBackground from "@/components/BubbleBackground";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, AlertTriangle, TrendingUp } from "lucide-react";

interface Session {
  id: string;
  plan_name: string;
  date: string;
  completed: boolean;
  user: {
    full_name: string;
    email: string;
  } | null;
  hr_records: Array<{
    phase_name: string;
    hr: number;
    systolic: number | null;
    diastolic: number | null;
    target: string;
    comment: string | null;
    timestamp: string;
  }>;
  sos_records: Array<{
    phase_name: string;
    symptoms: string;
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const { data: sessionsData, error } = await supabase
      .from("exercise_sessions")
      .select(`
        *,
        user:profiles(full_name, email),
        hr_records(*),
        sos_records(*)
      `)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error loading sessions:", error);
    }

    if (sessionsData) {
      console.log("Sessions data:", sessionsData);
      setSessions(sessionsData as any);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="font-bubblegum text-xl">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.completed).length;
  const totalSOSRecords = sessions.reduce((sum, s) => sum + s.sos_records.length, 0);

  // Agrupar sesiones por usuario y fecha
  const userSessions: Record<string, {
    email: string;
    name: string;
    dailySessions: Record<string, {
      sessions: Session[];
      avgHR: number;
      avgSystolic: number | null;
      avgDiastolic: number | null;
    }>;
  }> = {};

  sessions.forEach(session => {
    const userEmail = session.user?.email || 'unknown';
    const fullName = session.user?.full_name?.trim();
    const userName = (fullName && fullName.length > 0) ? fullName : session.user?.email || 'Usuario desconocido';
    const sessionDate = new Date(session.date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!userSessions[userEmail]) {
      userSessions[userEmail] = {
        email: userEmail,
        name: userName,
        dailySessions: {}
      };
    }

    if (!userSessions[userEmail].dailySessions[sessionDate]) {
      userSessions[userEmail].dailySessions[sessionDate] = {
        sessions: [],
        avgHR: 0,
        avgSystolic: null,
        avgDiastolic: null
      };
    }

    userSessions[userEmail].dailySessions[sessionDate].sessions.push(session);
  });

  // Calcular promedios por día
  Object.values(userSessions).forEach(user => {
    Object.values(user.dailySessions).forEach(day => {
      let totalHR = 0;
      let countHR = 0;
      let totalSystolic = 0;
      let totalDiastolic = 0;
      let countBP = 0;

      day.sessions.forEach(session => {
        session.hr_records.forEach(record => {
          totalHR += record.hr;
          countHR++;
          if (record.systolic) {
            totalSystolic += record.systolic;
            countBP++;
          }
          if (record.diastolic) {
            totalDiastolic += record.diastolic;
          }
        });
      });

      day.avgHR = countHR > 0 ? Math.round(totalHR / countHR) : 0;
      day.avgSystolic = countBP > 0 ? Math.round(totalSystolic / countBP) : null;
      day.avgDiastolic = countBP > 0 ? Math.round(totalDiastolic / countBP) : null;
    });
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-100 to-yellow-200 relative overflow-hidden">
      <BubbleBackground count={8} minSize={40} maxSize={120} />

      <div className="max-w-7xl mx-auto p-6 sm:p-10 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-caveat text-4xl font-bold mb-2">Dashboard de Administrador</h1>
            <p className="font-bubblegum text-gray-700">Vista completa de todas las sesiones</p>
          </div>
          <div className="flex gap-3">
            <Link to="/plans">
              <Button variant="outline" className="font-bubblegum">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Planes
              </Button>
            </Link>
            <Button onClick={signOut} variant="outline" className="font-bubblegum">
              Cerrar sesión
            </Button>
          </div>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sesiones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalSessions}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedSessions}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" /> Alertas SOS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{totalSOSRecords}</div>
            </CardContent>
          </Card>
        </div>

        {/* Vista por usuario */}
        <div className="space-y-6">
          {Object.values(userSessions).map((userData) => (
            <Card key={userData.email} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="font-caveat text-3xl">{userData.name}</CardTitle>
                <CardDescription className="font-bubblegum text-base">{userData.email}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {Object.entries(userData.dailySessions).map(([date, dayData]) => (
                  <div key={date} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-200">
                      <h3 className="font-caveat text-2xl font-bold text-gray-800">{date}</h3>
                      <div className="flex gap-4">
                        <div className="text-center bg-red-100 px-4 py-2 rounded-lg border-2 border-red-300">
                          <p className="text-xs text-red-700 font-semibold">FC Promedio</p>
                          <p className="text-2xl font-bold text-red-600">{dayData.avgHR} lpm</p>
                        </div>
                        {dayData.avgSystolic && dayData.avgDiastolic && (
                          <div className="text-center bg-blue-100 px-4 py-2 rounded-lg border-2 border-blue-300">
                            <p className="text-xs text-blue-700 font-semibold">TA Promedio</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {dayData.avgSystolic}/{dayData.avgDiastolic} mmHg
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sesiones del día */}
                    <div className="space-y-4 pl-4">
                      {dayData.sessions.map((session) => (
                        <div key={session.id} className="bg-white rounded-lg border-2 border-gray-200 p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bubblegum text-lg font-bold text-gray-800">{session.plan_name}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(session.date).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            {session.completed && (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold border-2 border-green-300">
                                Completada
                              </span>
                            )}
                          </div>

                          {/* Registros de HR y TA */}
                          {session.hr_records.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="font-bold text-sm flex items-center gap-2 text-gray-700">
                                <Heart className="h-4 w-4 text-red-500" />
                                Mediciones
                              </h5>
                              <div className="grid gap-2">
                                {session.hr_records.map((record, idx) => (
                                  <div key={idx} className="bg-gradient-to-r from-red-50 to-blue-50 p-3 rounded-lg border border-gray-300">
                                    <div className="flex justify-between items-center">
                                      <div className="flex-1">
                                        <p className="font-semibold text-sm text-gray-800">{record.phase_name}</p>
                                        <p className="text-xs text-gray-600">🎯 {record.target}</p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(record.timestamp).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                          })}
                                        </p>
                                        {record.comment && (
                                          <p className="text-xs italic mt-1 bg-yellow-50 p-1 rounded border border-yellow-200">
                                            💬 "{record.comment}"
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex gap-2">
                                        <div className="text-center bg-red-100 px-3 py-1 rounded-lg border border-red-300">
                                          <p className="text-xs text-red-700 font-semibold">FC</p>
                                          <p className="text-xl font-bold text-red-600">{record.hr}</p>
                                          <p className="text-xs text-red-700">lpm</p>
                                        </div>
                                        {(record.systolic || record.diastolic) && (
                                          <div className="text-center bg-blue-100 px-3 py-1 rounded-lg border border-blue-300">
                                            <p className="text-xs text-blue-700 font-semibold">TA</p>
                                            <p className="text-lg font-bold text-blue-600">
                                              {record.systolic || '?'}/{record.diastolic || '?'}
                                            </p>
                                            <p className="text-xs text-blue-700">mmHg</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Alertas SOS */}
                          {session.sos_records.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <h5 className="font-bold text-sm flex items-center gap-2 text-red-700 mb-2">
                                <AlertTriangle className="h-4 w-4" />
                                Alertas SOS ({session.sos_records.length})
                              </h5>
                              <div className="space-y-2">
                                {session.sos_records.map((record, idx) => (
                                  <div key={idx} className="bg-red-100 p-2 rounded-lg border border-red-400">
                                    <p className="font-semibold text-sm text-red-900">{record.phase_name}</p>
                                    <p className="text-xs text-gray-800">{record.symptoms}</p>
                                    <p className="text-xs text-gray-600">
                                      {new Date(record.timestamp).toLocaleTimeString('es-ES')}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {sessions.length === 0 && (
            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 font-bubblegum">No hay sesiones registradas aún</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}