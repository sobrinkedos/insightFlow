import { motion } from "framer-motion";
import { Download, Chrome, Globe, Flame, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export function ExtensionsPage() {
  const features = [
    "Compartilhe vídeos com um clique",
    "Detecção automática de vídeos",
    "Botão flutuante em todas as páginas",
    "Processamento automático com IA",
    "Suporte a múltiplas plataformas",
    "Interface moderna e intuitiva",
  ];

  const platforms = [
    { name: "YouTube", supported: true },
    { name: "Instagram", supported: true },
    { name: "TikTok", supported: true },
    { name: "Vimeo", supported: true },
    { name: "Dailymotion", supported: true },
  ];

  return (
    <motion.div
      className="container py-12 px-4 relative"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="fixed inset-0 -z-10 bg-mesh-gradient opacity-50" />
      <div className="fixed inset-0 -z-10 bg-pattern-dots" />
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          <Sparkles className="mr-2 h-3 w-3" />
          Novidade
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Extensões de Navegador
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Compartilhe vídeos de qualquer plataforma diretamente do seu navegador com apenas um clique
        </p>
      </div>

      {/* Browser Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-16">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Chrome className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Google Chrome</CardTitle>
              </div>
              <CardDescription>
                A extensão mais popular e testada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Versão 88+</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Manifest V3</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Sincronização automática</span>
                </div>
              </div>
              <Button className="w-full" asChild>
                <a href="/downloads/insightshare-chrome.zip" download>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar para Chrome
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="h-full border-primary">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-600/10">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-2">
                  <CardTitle>Microsoft Edge</CardTitle>
                  <Badge variant="default">Recomendado</Badge>
                </div>
              </div>
              <CardDescription>
                Melhor desempenho no Windows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Versão 88+</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Integração Windows 11</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Menor consumo de recursos</span>
                </div>
              </div>
              <Button className="w-full" asChild>
                <a href="/downloads/insightshare-edge.zip" download>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar para Edge
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle>Mozilla Firefox</CardTitle>
              </div>
              <CardDescription>
                Foco em privacidade e segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Versão 109+</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Código aberto</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Melhor privacidade</span>
                </div>
              </div>
              <Button className="w-full" asChild>
                <a href="/downloads/insightshare-firefox.zip" download>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar para Firefox
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Features & Installation */}
      <div className="grid gap-8 lg:grid-cols-2 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Recursos Principais</CardTitle>
            <CardDescription>
              Tudo que você precisa para compartilhar vídeos inteligentemente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plataformas Suportadas</CardTitle>
            <CardDescription>
              Funciona em todas as principais plataformas de vídeo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{platform.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">Mais em breve...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Installation Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Como Instalar</CardTitle>
          <CardDescription>
            Guia passo a passo para cada navegador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chrome" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chrome">Chrome</TabsTrigger>
              <TabsTrigger value="edge">Edge</TabsTrigger>
              <TabsTrigger value="firefox">Firefox</TabsTrigger>
            </TabsList>

            <TabsContent value="chrome" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Baixe a extensão</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique no botão "Baixar para Chrome" acima
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Abra as extensões</h4>
                    <p className="text-sm text-muted-foreground">
                      Vá para <code className="bg-muted px-1 py-0.5 rounded">chrome://extensions/</code>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ative o modo desenvolvedor</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique no switch no canto superior direito
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Carregue a extensão</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique em "Carregar sem compactação" e selecione a pasta
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Configure e use!</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique no ícone da extensão e configure sua API key
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="edge" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Baixe a extensão</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique no botão "Baixar para Edge" acima
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Abra as extensões</h4>
                    <p className="text-sm text-muted-foreground">
                      Vá para <code className="bg-muted px-1 py-0.5 rounded">edge://extensions/</code>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ative o modo desenvolvedor</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique no switch no canto inferior esquerdo
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Carregue a extensão</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique em "Carregar sem compactação" e selecione a pasta
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Configure e use!</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique no ícone da extensão e configure sua API key
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="firefox" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Baixe a extensão</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique no botão "Baixar para Firefox" acima
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Abra o debug</h4>
                    <p className="text-sm text-muted-foreground">
                      Vá para <code className="bg-muted px-1 py-0.5 rounded">about:debugging#/runtime/this-firefox</code>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Carregue temporariamente</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique em "Carregar extensão temporária"
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Selecione o manifest</h4>
                    <p className="text-sm text-muted-foreground">
                      Escolha o arquivo manifest.json da pasta
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Configure e use!</h4>
                    <p className="text-sm text-muted-foreground">
                      Clique no ícone da extensão e configure sua API key
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Download Info */}
      <Card className="mb-16">
        <CardHeader>
          <CardTitle>Informações de Download</CardTitle>
          <CardDescription>
            Detalhes sobre os arquivos disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Arquivos ZIP Prontos</h4>
                <p className="text-sm text-muted-foreground">
                  Todos os arquivos estão compactados e prontos para instalação. 
                  Basta baixar, extrair e seguir as instruções.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Sem Instalação Complexa</h4>
                <p className="text-sm text-muted-foreground">
                  Não é necessário compilar ou configurar nada. 
                  Os arquivos estão prontos para uso imediato.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Atualizações Gratuitas</h4>
                <p className="text-sm text-muted-foreground">
                  Volte a esta página para baixar novas versões quando disponíveis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Sparkles className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Versão Atual: 1.0.0</h4>
                <p className="text-sm text-muted-foreground">
                  Lançamento inicial - 16 de outubro de 2025
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-12">
            <h2 className="text-2xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Baixe a extensão para seu navegador favorito e comece a compartilhar vídeos de forma inteligente hoje mesmo!
            </p>
            <Button size="lg" asChild>
              <a href="#top">
                <Download className="mr-2 h-5 w-5" />
                Escolher Navegador
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
