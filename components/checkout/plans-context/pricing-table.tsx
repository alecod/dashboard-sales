import { Card } from '@/components/ui/card'
import { plansDetails } from '@/data/plans'

export function PricingTable() {
  return (
    <Card className='text-gray-700 mt-[3rem] w-full'>
      <table className='block min-w-full border-collapse md:table'>
        <thead className='block md:table-header-group'>
          <tr className='absolute -left-full -top-full block md:relative md:left-auto md:top-auto md:table-row'>
            <th className='text-gray-700 md block p-2 text-center font-bold md:table-cell' />
            {plansDetails.map((plan, index) => (
              <th
                key={Number(index)}
                className={`text-gray-700 md block p-2 text-center font-bold md:table-cell ${
                  plan.name === 'Essentials' ? 'border-green-500 border-2' : ''
                }`}
              >
                <span className='text-base'> {plan.name}</span> <br />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='block space-y-12 md:table-row-group'>
          <tr className='block md:table-row'>
            <td className='md block p-2 pl-5 text-left text-[1rem] md:table-cell md:border'>
              Pedidos feitos no mês
            </td>
            {plansDetails.map((plan, index) => (
              <td
                key={Number(index)}
                className='md block p-2 text-center md:table-cell md:border'
              >
                {plan.features.pedidos}
              </td>
            ))}
          </tr>
          <tr className='block md:table-row'>
            <td className='md block p-2 pl-5 text-left text-[1rem] md:table-cell md:border'>
              Fonte de tráfego
            </td>
            {plansDetails.map((plan, index) => (
              <td
                key={Number(index)}
                className='md block p-2 text-center md:table-cell md:border'
              >
                {plan.features.trafego}
              </td>
            ))}
          </tr>
          <tr className='block md:table-row'>
            <td className='md block p-2 pl-5 text-left text-[1rem] md:table-cell md:border'>
              Usuários
            </td>
            {plansDetails.map((plan, index) => (
              <td
                key={Number(index)}
                className='md block p-2 text-center md:table-cell md:border'
              >
                {plan.features.usuarios}
              </td>
            ))}
          </tr>
          <tr className='block md:table-row'>
            <td className='md block p-2 pl-5 text-left text-[1rem] md:table-cell md:border'>
              Dominios
            </td>
            {plansDetails.map((plan, index) => (
              <td
                key={Number(index)}
                className='md block p-2 text-center md:table-cell md:border'
              >
                {plan.features.dominios}
              </td>
            ))}
          </tr>
          <tr className='block md:table-row'>
            <td className='md block p-2 pl-5 text-left text-[1rem] md:table-cell md:border'>
              Dashboard Financeiro
            </td>
            {plansDetails.map((plan, index) => (
              <td
                key={Number(index)}
                className='md block p-2 text-center md:table-cell md:border'
              >
                {plan.features.dashboardFinanceiro}
              </td>
            ))}
          </tr>
          <tr className='block md:table-row'>
            <td className='md block p-2 pl-5 text-left text-[1rem] md:table-cell md:border'>
              Rastreamento de campanhas
            </td>
            {plansDetails.map((plan, index) => (
              <td
                key={Number(index)}
                className='md block p-2 text-center md:table-cell md:border'
              >
                {plan.features.rastreamento}
              </td>
            ))}
          </tr>
          <tr className='block md:table-row'>
            <td className='md block p-2 pl-5 text-left text-[1rem] md:table-cell md:border'>
              Otimização de acampanhas
            </td>
            {plansDetails.map((plan, index) => (
              <td
                key={Number(index)}
                className='md block p-2 text-center md:table-cell md:border'
              >
                {plan.features.otimizacao}
              </td>
            ))}
          </tr>
          <tr className='block md:table-row'>
            <td className='md block p-2 pl-5 text-left text-[1rem] md:table-cell md:border'>
              Dicas de IA
            </td>
            {plansDetails.map((plan, index) => (
              <td
                key={Number(index)}
                className='md block p-2 text-center md:table-cell md:border'
              >
                {plan.features.ia}
              </td>
            ))}
          </tr>
          <tr className='block md:table-row'>
            <td className='md text-ledt block p-2 pl-5 text-[1rem] md:table-cell md:border'>
              Consultoria especializada
            </td>
            {plansDetails.map((plan, index) => (
              <td
                key={Number(index)}
                className='md block p-2 text-center md:table-cell md:border'
              >
                {plan.features.consultoria}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Card>
  )
}
