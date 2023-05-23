export default function getEventName(abi, events) {
  const abiEvents = abi.filter((entry) => entry.type === 'event')
  
  return events.map((event) => {
    const keys = Object.keys(event)
    const abiEvent = abiEvents.find((e) => {
      const inspect = e.inputs.map((input) => input.name)

      return inspect.length === keys.length && keys.every((key) => inspect.includes(key))
    })
    
    if (!abiEvent) {
      throw new Error('Event not found')
    }

    return abiEvent.name
  })
}