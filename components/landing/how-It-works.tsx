import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-3">
          <Badge className="hidden sm:inline-flex">Cómo funciona</Badge>
          <h2 className="text-2xl font-semibold tracking-tight">Tres pasos simples</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[{
            title: "1. Preparación",
            text: "Buscá un lugar tranquilo y asegurate de tener sonido si es necesario.",
          }, {
            title: "2. Tareas de estímulo",
            text: "Respondé a estímulos visuales o auditivos lo más rápido y preciso posible.",
          }, {
            title: "3. Resultados",
            text: "Obtené métricas clave y una interpretación clara de tu atención.",
          }].map((s, i) => (
            <Card key={s.title} className="relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-600/40" />
              <CardContent className="pt-8">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-semibold text-white">
                  {i + 1}
                </div>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
