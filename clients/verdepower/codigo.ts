const ALFABETO = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // sin 0, O, 1, I, L

export function generarCodigo(): string {
  let codigo = "";
  for (let i = 0; i < 5; i++) {
    codigo += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  }
  return codigo;
}
