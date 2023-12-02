import { apply, getBooking, reject } from "@/interfaces/interfaces"
import { Button, Flex } from "antd"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

export const BookingManageDetail = () => {
  const params = useParams() as { id: string }
  const id = +params.id
  useEffect(() => {
    getBooking(id).then(console.log)
  }, [id])
  return (
    <div>
      <h3>申请单id：{id}</h3>
      <Flex gap={5}>
        <Button type='primary' onClick={() => {
          apply(id)
        }}>通过</Button>
        <Button type='primary' danger onClick={() => {
          reject(id)
        }}>驳回</Button>
      </Flex>
    </div>
  )
}