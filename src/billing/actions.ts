import { toast } from "sonner";

export async function onBuyAvulso10() {
  toast.info("Checkout de avulso (10 fotos por R$ 19,90) será configurado na próxima etapa.");
}

export async function onSubscribeBasic() {
  toast.info("Checkout de assinatura Básica (R$ 29,90/mês) será configurado na próxima etapa.");
}

export async function onSubscribeComplete() {
  toast.info("Checkout de assinatura Completa (R$ 49,90/mês) será configurado na próxima etapa.");
}

export async function onBuyExtras10() {
  toast.info("Checkout de extras (+10 por R$ 9,90) será configurado na próxima etapa.");
}