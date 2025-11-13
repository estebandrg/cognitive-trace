import { BrainCircuit, Clock, Gauge, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Methodology = {
  name: string;
  description: string;
  icon: React.ReactNode;
};

export default function ScientificValidation() {
  const methodologies: Methodology[] = [
    {
      name: "Tarea SART",
      description:
        "Mide la capacidad de mantener el foco atencional sostenido y detectar lapsos de atención en tiempo real, evaluando la consistencia en la respuesta a estímulos.",
      icon: <BrainCircuit className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
    },
    {
      name: "Stroop y Flanker",
      description:
        "Evalúan el control inhibitorio y la capacidad de resistir la interferencia de estímulos distractores, midiendo el tiempo de reacción ante conflictos cognitivos.",
      icon: <Gauge className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
    },
    {
      name: "Tarea N-Back",
      description:
        "Analiza la memoria de trabajo, la retención de información y la capacidad de actualizar el foco atencional bajo diferentes cargas cognitivas.",
      icon: <Zap className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
    },
    {
      name: "Tarea PVT",
      description:
        "Registra los tiempos de reacción y la variabilidad en el procesamiento atencional, siendo un indicador sensible a la fatiga mental.",
      icon: <Clock className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
    },
  ];

  return (
    <section id="base-cientifica" className="py-20">
      <div className="pointer-events-none absolute inset-x-0 -z-10 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-3">
          <Badge className="hidden sm:inline-flex">Metodología</Badge>
          <h2 className="text-2xl font-semibold tracking-tight">Base Científica</h2>
        </div>
        <p className="mb-8 max-w-3xl text-muted-foreground">
          Nuestras evaluaciones están respaldadas por metodologías validadas científicamente para medir con precisión las capacidades cognitivas.
        </p>
        
        <div className="grid gap-6 sm:grid-cols-2">
          {methodologies.map((methodology, index) => (
            <Card
              key={index}
              className="relative overflow-hidden transition-transform hover:-translate-y-0.5"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10">
                    {methodology.icon}
                  </span>
                  <CardTitle className="text-base">{methodology.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{methodology.description}</p>
              </CardContent>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
