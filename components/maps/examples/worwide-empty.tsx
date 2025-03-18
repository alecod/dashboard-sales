import WorldMap from 'react-svg-worldmap'

export function MapChartEmpity() {
  return (
    <div className='relative right-3 h-auto sm:w-[420px] md:w-[520px]'>
      <WorldMap
        strokeOpacity={3}
        color='#19dbfe'
        borderColor='#fff'
        backgroundColor='transparent'
        tooltipBgColor='black'
        size='lg'
        data={[]}
      />
    </div>
  )
}
