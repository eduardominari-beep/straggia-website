"use client"

export function PreDiagnosticoSection() {
  const embedUrl = process.env.NEXT_PUBLIC_GFORM_EMBED_URL

  return (
    <section id="pre-diagnostico" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-balance mb-4">
            <span className="text-secondary">Dê o primeiro passo para </span> transformar sua gestão
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Preencha o pré-diagnóstico gratuito e, em até 48 horas, enviaremos um relatório preliminar feito sob medida para a sua realidade.
          </p>
        </div>

        <div className="bg-card rounded-lg p-8 border border-border">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="600"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="rounded-lg"
              title="Formulário de Pré-Diagnóstico"
            >
              Carregando…
            </iframe>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-display font-semibold mb-2 text-primary">Formulário em Configuração</h3>
              <p className="text-muted-foreground mb-6">
                O formulário de pré-diagnóstico será disponibilizado em breve.
              </p>
              <p className="text-sm text-muted-foreground">
                Para configurar, adicione a variável de ambiente{" "}
                <code className="bg-muted px-2 py-1 rounded text-primary">NEXT_PUBLIC_GFORM_EMBED_URL</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
