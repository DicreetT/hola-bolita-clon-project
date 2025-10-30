import { useNavigate } from "react-router-dom";
import BubbleBackground from "@/components/BubbleBackground";
import bolitaDoctor from "@/assets/bolita-doctor.png";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <section className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/bolita/home.png)' }}>
        <BubbleBackground count={6} minSize={40} maxSize={100} opacity="bg-white/20" />

        <main className="mx-auto max-w-7xl p-6 sm:p-10 relative z-10">
          <div className="flex min-h-screen items-center justify-center py-8">
            <div className="max-w-3xl text-center">
              <div className="mb-2 inline-block rotate-[-4deg] bg-yellow-400 px-4 py-1 rounded-lg shadow-lg transform hover:rotate-[4deg] transition-transform duration-300">
                <span className="font-bubblegum text-xl text-black">
                  ¡Bienvenido!
                </span>
              </div>
              
              <h1 className="font-caveat text-5xl sm:text-6xl font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] animate-pulse-subtle text-white mb-4">
                Rehabilitación cardiaca para volver a tu vida con seguridad
              </h1>
              
              <p className="mt-4 text-lg sm:text-xl text-white drop-shadow-md bg-black/40 backdrop-blur-sm rounded-xl p-4 mb-6">
                Acompañamiento de especialistas: ejercicio, educación y apoyo emocional para ti y tu familia.
              </p>

              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-black/10 max-w-md mx-auto">
                <img 
                  src={bolitaDoctor} 
                  alt="Bolita como doctora" 
                  className="w-32 h-32 mx-auto mb-6 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                />

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Tus datos se tratan con confidencialidad. Esta información es educativa y no sustituye tu consulta médica.
                    Si presentas dolor en el pecho, falta de aire intensa o mareo, acude a urgencias.
                  </p>
                </div>

                <div className="mt-6 p-4 bg-white/80 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm">Qué esperar</h3>
                  <ol className="text-xs text-gray-700 space-y-2 list-decimal list-inside">
                    <li>Valoración inicial</li>
                    <li>Plan de ejercicio adaptado y monitorizado</li>
                    <li>Educación (medicación, nutrición, estrés)</li>
                    <li>Seguimiento y alta con plan en casa</li>
                  </ol>
                </div>

                <button 
                  onClick={() => navigate("/info")}
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg border-2 border-black/10 transition-all duration-300 hover:scale-105"
                >
                  ¡Vamos allá!
                </button>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
