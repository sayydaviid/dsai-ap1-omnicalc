# Fontes e convenções

- [NIST SP 811, Appendix B](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors): conversão pelo fator para uma unidade-base e divisão na conversão inversa.
- [NIST B.9](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b9): fatores organizados por grandeza.
- [BIPM — prefixos SI](https://www.bipm.org/en/measurement-units/si-prefixes): múltiplos e submúltiplos decimais.
- [NIST — prefixos binários](https://physics.nist.gov/cuu/Units/binary.html): KiB, MiB, GiB, TiB e PiB; cada byte tem oito bits.
- [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021): /31 em links ponto a ponto.

As constantes estão em src/catalog/units.js, não são buscadas na rede em execução.
Unidades imperiais são qualificadas; ano significa ano juliano de 365,25 dias e não
diferença entre datas. Frequências de rotação são medidas em ciclos por segundo.
BTU usa International Table; caloria usa definição termoquímica.

Ângulos usam Math.PI. Fatores que exigem divisão e definições não decimais são
aproximações binárias de dupla precisão. Resultados têm até 12 algarismos
significativos na tela. Não se promete aritmética decimal exata, nem precisão
metrológica. Valores extremos podem sofrer arredondamento/underflow; intermediário
não finito é rejeitado. Temperaturas são absolutas, não diferenças de temperatura.

Os testes gerados usam resultados fixos calculados com BigInt racional sobre os
fatores do catálogo, mais invariantes e casos de erro. Eles detectam regressões do
motor, mas não tornam independentes os fatores de origem. Tests/catalog.test.js
inclui referências conhecidas para verificar constantes e convenções.
