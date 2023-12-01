import { useCallback, useEffect, useState } from "react"
import { getEquipments as getEquipmentsInterface } from "@/interface/interfaces" 

interface Option {
  label: string
  value: number
}

interface UseGetEquipmentsProps {
  include_used?: boolean
  meeting_room_id?: number
  requestFirst?: boolean
}
export function useGetEquipments(props?: UseGetEquipmentsProps) {
  const {
    include_used = false,
    meeting_room_id,
    requestFirst = false
  } = props || {}
  const [equipments, setEquipments] = useState<Option[]>([])
  const  getEquipments = useCallback(() =>  {
    getEquipmentsInterface(include_used).then(({data}) => {
    const equipments = data.data as {name: string, id: number,is_used: boolean, meeting_room_id?: number}[]
    const newEquipmentOptions:Option[] =  []
      equipments.forEach(equipment => {
          if (equipment.is_used && meeting_room_id && equipment.meeting_room_id !== meeting_room_id) return
          newEquipmentOptions.push({
              label: equipment.name,
              value: equipment.id
          })
      })
      setEquipments(newEquipmentOptions)
    })
  }, [include_used, meeting_room_id])

  useEffect(() => {
    if (requestFirst) {
      getEquipments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [equipments, getEquipments] as const
}

