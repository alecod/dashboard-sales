import { FaTruck, FaTrafficLight, FaUsers, FaGlobe } from 'react-icons/fa'

interface Plan {
  name: string
  prices: {
    monthly: number
    semiannual: number
    annual: number
  }
  details: Array<{ text: string; icon: JSX.Element }>
}

export const plans: Plan[] = [
  {
    name: 'Starter',
    prices: {
      monthly: 49.9,
      semiannual: (49.9 * 6 * 0.85) / 6, // 15% de desconto
      annual: (49.9 * 12 * 0.65) / 12, // 35% de desconto
    },
    details: [
      { text: 'Pedidos por mês: 50', icon: <FaTruck /> },
      { text: 'Fontes de tráfego: 1', icon: <FaTrafficLight /> },
      { text: 'Usuários: 1', icon: <FaUsers /> },
      { text: 'Domínios: 1', icon: <FaGlobe /> },
    ],
  },
  {
    name: 'Basic',
    prices: {
      monthly: 99.9,
      semiannual: (99.9 * 6 * 0.85) / 6, // 15% de desconto
      annual: (99.9 * 12 * 0.65) / 12, // 35% de desconto
    },
    details: [
      { text: 'Pedidos por mês: 250', icon: <FaTruck /> },
      { text: 'Fontes de tráfego: 2', icon: <FaTrafficLight /> },
      { text: 'Usuários: 2', icon: <FaUsers /> },
      { text: 'Domínios: 2', icon: <FaGlobe /> },
    ],
  },
  {
    name: 'Pro',
    prices: {
      monthly: 149.9,
      semiannual: (149.9 * 6 * 0.85) / 6, // 15% de desconto
      annual: (149.9 * 12 * 0.65) / 12, // 35% de desconto
    },
    details: [
      { text: 'Pedidos por mês: 500', icon: <FaTruck /> },
      { text: 'Fontes de tráfego: 3', icon: <FaTrafficLight /> },
      { text: 'Usuários: 3', icon: <FaUsers /> },
      { text: 'Domínios: 3', icon: <FaGlobe /> },
    ],
  },
  {
    name: 'Advanced',
    prices: {
      monthly: 249.9,
      semiannual: (249.9 * 6 * 0.85) / 6, // 15% de desconto
      annual: (249.9 * 12 * 0.65) / 12, // 35% de desconto
    },
    details: [
      { text: 'Pedidos por mês: 1000', icon: <FaTruck /> },
      { text: 'Fontes de tráfego: 4', icon: <FaTrafficLight /> },
      { text: 'Usuários: ilimitado', icon: <FaUsers /> },
      { text: 'Domínios: ilimitado', icon: <FaGlobe /> },
    ],
  },
  {
    name: 'Enterprise',
    prices: {
      monthly: 499.9,
      semiannual: (499.9 * 6 * 0.85) / 6, // 15% de desconto
      annual: (499.9 * 12 * 0.65) / 12, // 35% de desconto
    },
    details: [
      { text: 'Pedidos por mês: 2000', icon: <FaTruck /> },
      { text: 'Fontes de tráfego: 4', icon: <FaTrafficLight /> },
      { text: 'Usuários: ilimitado', icon: <FaUsers /> },
      { text: 'Domínios: ilimitado', icon: <FaGlobe /> },
    ],
  },
]

export const plansDetails = [
  {
    name: 'Starter',
    price: 'Teste gratis por 7 dias',
    features: {
      pedidos: '50',
      trafego: '1',
      usuarios: '1',
      dominios: '1',
      dashboardFinanceiro: '✓',
      rastreamento: 'X',
      otimizacao: 'X',
      ia: 'X',
      consultoria: 'X',
    },
  },
  {
    name: 'Basic',
    price: 'Teste gratis por 7 dias',
    features: {
      pedidos: '250',
      trafego: '2',
      usuarios: '2',
      dominios: '2',
      dashboardFinanceiro: '✓',
      rastreamento: '✓',
      otimizacao: '✓',
      ia: 'X',
      consultoria: 'X',
    },
  },
  {
    name: 'Pro',
    price: 'Teste gratis por 7 dias',
    features: {
      pedidos: '500',
      trafego: '3',
      usuarios: '3',
      dominios: '3',
      dashboardFinanceiro: '✓',
      rastreamento: '✓',
      otimizacao: '✓',
      ia: '✓',
      consultoria: 'x',
    },
  },
  {
    name: 'Advanced',
    price: 'Teste gratis por 7 dias',
    features: {
      pedidos: '1000',
      trafego: '4',
      usuarios: 'Ilimitados',
      dominios: 'Ilimitados',
      dashboardFinanceiro: '✓',
      rastreamento: '✓',
      otimizacao: '✓',
      ia: '✓',
      consultoria: '✓',
    },
  },

  {
    name: 'Enterprise',
    price: 'Teste gratis por 7 dias',
    features: {
      pedidos: '2000',
      trafego: '4',
      usuarios: 'Ilimitados',
      dominios: 'Ilimitados',
      dashboardFinanceiro: '✓',
      rastreamento: '✓',
      otimizacao: '✓',
      ia: '✓',
      consultoria: '✓',
    },
  },
]
