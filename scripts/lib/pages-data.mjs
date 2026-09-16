// Fonte única de verdade para as 3 variações da home (templates/page.template.html).
// Editar copy/SEO aqui e rodar `node scripts/build-pages.mjs` para regenerar
// index.html, corretores/index.html e imobiliarias/index.html.

export const pages = [
  {
    slug: '',
    outFile: 'index.html',
    canonical: 'https://www.imobilmkt.com.br/',
    navLabel: 'Página inicial',

    title: 'Marketing para Corretores de Imóveis, Imobiliárias e Construtoras | IMOBIL',
    metaDescription: 'Agência de marketing digital especializada em corretores de imóveis, imobiliárias, construtoras e arquitetos. Tráfego pago, branding, conteúdo e landing pages que geram leads e vendas de imóveis em todo o Brasil.',
    ogTitle: 'Marketing para Corretores de Imóveis, Imobiliárias e Construtoras | IMOBIL',
    ogDescription: 'Agência de marketing digital 100% focada no mercado imobiliário. Tráfego pago, branding e conteúdo que transformam anúncios em vendas de imóveis para corretores autônomos e negócios imobiliários.',
    twitterTitle: 'Marketing para Corretores de Imóveis, Imobiliárias e Construtoras | IMOBIL',
    twitterDescription: 'Agência de marketing digital 100% focada no mercado imobiliário. Tráfego pago, branding e conteúdo que geram leads e vendas de imóveis para corretores e negócios imobiliários.',

    heroEyebrow: 'Marketing digital para todo o mercado imobiliário',
    heroH1: `O marketing que<br>
        move todo o <span class="accent-word">mercado imobiliário</span>.`,
    heroSub: 'Tráfego pago, branding e conteúdo para corretores de imóveis, imobiliárias, construtoras, incorporadoras e arquitetos venderem e alugarem mais, em todo o Brasil.',

    problemaHeadline: 'Seu negócio imobiliário<br>está <span class="accent-line">invisível</span><br>no digital?',
    problemaBody: `<p class="problema-body reveal reveal-delay-1">
            Enquanto concorrentes dominam o Google, o Instagram e o YouTube, seus imóveis e lançamentos ficam esperando por compradores que nunca chegam pelo canal certo.
          </p>
          <p class="problema-body reveal reveal-delay-2">
            O mercado imobiliário é um dos mais competitivos do Brasil — e a diferença entre fechar ou perder negócios de centenas de milhares de reais está na <strong>estratégia digital que seu negócio ainda não tem.</strong>
          </p>`,
  },

  {
    slug: 'corretores',
    outFile: 'corretores/index.html',
    canonical: 'https://www.imobilmkt.com.br/corretores/',
    navLabel: 'Para corretores',

    title: 'Marketing Digital para Corretores de Imóveis | Gere Leads Próprios | IMOBIL',
    metaDescription: 'Agência especializada em marketing digital para corretores de imóveis autônomos. Tráfego pago, Instagram e marca pessoal para você parar de depender de portal e indicação e gerar seus próprios leads qualificados.',
    ogTitle: 'Marketing Digital para Corretores de Imóveis | IMOBIL',
    ogDescription: 'Tráfego pago, Instagram e marca pessoal para o corretor de imóveis autônomo gerar seus próprios leads qualificados, sem depender só de portal ou indicação.',
    twitterTitle: 'Marketing Digital para Corretores de Imóveis | IMOBIL',
    twitterDescription: 'Tráfego pago, Instagram e marca pessoal para o corretor de imóveis autônomo gerar seus próprios leads qualificados.',

    heroEyebrow: 'Marketing digital para corretores de imóveis',
    heroH1: `Pare de dividir<br>
        lead com <span class="accent-word">outros corretores</span>.<br>
        Gere os <span class="accent-word">seus</span>.`,
    heroSub: 'Tráfego pago, Instagram e marca pessoal para você, corretor autônomo, parar de depender de portal e indicação — e vender mais com leads que chegam só para você.',

    problemaHeadline: 'Seu nome está<br><span class="accent-line">perdido</span><br>entre mil corretores?',
    problemaBody: `<p class="problema-body reveal reveal-delay-1">
            Nos portais e grupos de WhatsApp, você compete por atenção com centenas de outros corretores oferecendo o mesmo imóvel. Quem tem estratégia digital própria sai na frente — quem não tem, fica esperando a sorte de uma indicação.
          </p>
          <p class="problema-body reveal reveal-delay-2">
            Construir a sua marca pessoal e gerar tráfego pago direto para o seu contato é o que separa o corretor que vive de indicação do corretor que decide <strong>quantos leads quer todo mês.</strong>
          </p>`,
  },

  {
    slug: 'imobiliarias',
    outFile: 'imobiliarias/index.html',
    canonical: 'https://www.imobilmkt.com.br/imobiliarias/',
    navLabel: 'Para imobiliárias',

    title: 'Marketing Digital para Imobiliárias e Construtoras | Leads em Escala | IMOBIL',
    metaDescription: 'Agência de marketing 100% focada em imobiliárias e construtoras. Tráfego pago, branding e conteúdo para gerar leads em escala para todo o seu time de corretores e fortalecer sua marca no mercado.',
    ogTitle: 'Marketing Digital para Imobiliárias e Construtoras | IMOBIL',
    ogDescription: 'Tráfego pago, branding e conteúdo para sua imobiliária gerar leads em escala para todo o time de corretores e fortalecer a marca na sua região.',
    twitterTitle: 'Marketing Digital para Imobiliárias e Construtoras | IMOBIL',
    twitterDescription: 'Tráfego pago, branding e conteúdo para sua imobiliária gerar leads em escala para todo o time de corretores.',

    heroEyebrow: 'Marketing para Imobiliárias',
    heroH1: `Leads em escala<br>
        para <span class="accent-word">toda</span><br>
        a sua <span class="accent-word">equipe</span>.`,
    heroSub: 'Tráfego pago, branding e conteúdo para sua imobiliária gerar um fluxo constante de leads qualificados, fortalecer a marca na sua região e dar munição para todo o time de corretores vender mais.',

    problemaHeadline: 'Sua imobiliária<br>está <span class="accent-line">invisível</span><br>diante das maiores?',
    problemaBody: `<p class="problema-body reveal reveal-delay-1">
            Enquanto imobiliárias maiores dominam o Google e o Instagram na sua região, seus empreendimentos e imóveis de carteira ficam esperando um comprador que talvez esteja fechando negócio com o concorrente.
          </p>
          <p class="problema-body reveal reveal-delay-2">
            O mercado imobiliário é um dos mais competitivos do Brasil — e a diferença entre crescer o volume de vendas ou perder mercado está na <strong>estratégia digital estruturada que sua imobiliária ainda não tem.</strong>
          </p>`,
  },
];
