import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BubbleBackground from "@/components/BubbleBackground";
import { Heart, Activity, TrendingUp, Shield } from "lucide-react";

export default function HeartHealthInfo() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Heart,
      title: "Fortalece el corazón",
      description: "El ejercicio regular mejora la capacidad del corazón para bombear sangre de manera más eficiente."
    },
    {
      icon: Activity,
      title: "Mejora la circulación",
      description: "Aumenta el flujo sanguíneo y reduce la presión arterial, disminuyendo el riesgo de enfermedades cardiovasculares."
    },
    {
      icon: TrendingUp,
      title: "Aumenta la resistencia",
      description: "Mejora tu capacidad física y te ayuda a realizar actividades diarias con menos fatiga."
    },
    {
      icon: Shield,
      title: "Previene complicaciones",
      description: "Reduce el riesgo de ataques cardíacos, accidentes cerebrovasculares y otras complicaciones."
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-100 to-yellow-200">
      <BubbleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-bubblegum text-4xl md:text-5xl mb-4 text-gray-900">
              El ejercicio y tu corazón
            </h1>
            <p className="text-lg text-gray-700">
              Descubre cómo el ejercicio puede transformar tu salud cardiovascular
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 p-3 rounded-xl">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bubblegum text-xl mb-2 text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-700">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Section */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="font-bubblegum text-2xl md:text-3xl mb-4 text-center text-gray-900">
              Entendiendo la insuficiencia cardíaca
            </h2>
            <p className="text-center text-gray-700 mb-6">
              Aprende más sobre esta condición y cómo el ejercicio puede ayudarte
            </p>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/j9k1MJImOhA"
                title="Video sobre insuficiencia cardíaca"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white font-bubblegum text-xl px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              ¡Comienza tu rehabilitación!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
