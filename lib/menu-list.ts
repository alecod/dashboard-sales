import { routes } from '@/routes/routes'
import {
	BarChart,
	CogIcon,
	DollarSign,
	Headset,
	type LucideIcon,
	Megaphone,
	Menu,
	ShoppingCart,
	Store,
} from 'lucide-react'

type Submenu2 = {
	href: string
	label: string
	active: boolean
	icon?: LucideIcon
}

type Submenu = {
	href: string
	label: string
	active: boolean
	icon?: LucideIcon
	sub?: Submenu2[]
}

type Menus10 = {
	href: string
	label: string
	active?: boolean
	icon: LucideIcon
	submenus?: Submenu[]
}

type Group = {
	groupLabel: string
	menus: Menus10[]
}

export function getMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: '',
			menus: [
				{
					href: routes.dashboard,
					label: 'Painel Inicial',
					icon: Store,
					submenus: [],
				},
				{
					href: '',
					label: 'E-commerce',
					icon: ShoppingCart,
					submenus: [
						{
							href: routes.orders,
							label: 'Pedidos Totais',
							active: pathname.includes(routes.orders),
						},
					],
				},
				{
					href: '',
					label: 'Canais',
					icon: Megaphone,
					submenus: [
						{
							href: '',
							label: 'Facebook',
							active: false,
							sub: [
								{
									href: routes.facebookads,
									label: 'Campanhas',
									active: pathname.includes(routes.facebookads),
								},
								{
									href: routes.facebookPixel,
									label: 'Relatório de Eventos',
									active: pathname.includes(routes.facebookPixel),
								},
							],
						},
					],
				},
				{
					href: routes.analytics,
					active: pathname.includes(routes.analytics),
					label: 'Analytics',
					icon: BarChart,
					submenus: [],
				},
				{
					href: routes.coast,
					label: 'Custos',
					active: pathname.includes(routes.coast),
					icon: DollarSign,
					submenus: [],
				},
				{
					href: routes.integrations,
					label: 'Integrações',
					active: pathname.includes(routes.integrations),
					icon: CogIcon,
					submenus: [],
				},
			],
		},
	]
}
