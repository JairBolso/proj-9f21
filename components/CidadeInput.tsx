// Campo de cidade em texto livre, no formato "Cidade/UF". Mantido simples
// de propósito: o datalist com a lista inteira de municípios confundia
// quem preenchia (abria uma caixa gigante ao lado), então aqui é só um
// input com placeholder de exemplo.
export function CidadeInput({
  name = "cidade",
  defaultValue,
  className,
}: {
  name?: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <input
      name={name}
      autoComplete="off"
      defaultValue={defaultValue}
      placeholder="Ex: São Paulo/SP"
      className={className}
    />
  );
}
