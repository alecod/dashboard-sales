import WorldMap from 'react-svg-worldmap'

type WorldwideProps = {
  results: Array<{
    name: string
    visitors: number
    code: string
    flag: string
    alpha_3: string
    percentage: number
  }>
}

export function MapChart({ results = [] }: WorldwideProps) {
  const formattedData = results.map((item) => ({
    country: item.code,
    value: item.visitors,
  }))

  return (
    <div className='relative right-3 h-auto sm:w-[420px] md:w-[520px]'>
      <WorldMap
        strokeOpacity={3}
        color='#19dbfe'
        borderColor='#fff'
        backgroundColor='transparent'
        tooltipBgColor='black'
        size='lg'
        data={formattedData}
      />
    </div>
  )
}
