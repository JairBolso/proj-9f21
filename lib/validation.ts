// Valida celular brasileiro: DDD (2 dígitos, 11–99) + 9 + 8 dígitos.
// Aceita formatos com máscara ("(17) 99716-8842") ou só dígitos,
// com ou sem o DDI 55 na frente.
export function validarWhatsappBR(valor: string): {
  valido: boolean;
  digitos: string;
  erro?: string;
} {
  let digitos = valor.replace(/\D/g, "");
  if (digitos.startsWith("55") && digitos.length > 11) {
    digitos = digitos.slice(2);
  }

  if (digitos.length !== 11) {
    return {
      valido: false,
      digitos,
      erro: "Informe DDD + 9 dígitos (ex: 17 99999-9999).",
    };
  }

  const ddd = Number(digitos.slice(0, 2));
  if (ddd < 11 || ddd > 99) {
    return { valido: false, digitos, erro: "DDD inválido." };
  }

  if (digitos[2] !== "9") {
    return {
      valido: false,
      digitos,
      erro: "Número de celular deve começar com 9 após o DDD.",
    };
  }

  if (/^(\d)\1+$/.test(digitos.slice(2))) {
    return { valido: false, digitos, erro: "Número de celular inválido." };
  }

  return { valido: true, digitos: `55${digitos}` };
}
