import { PropsWithChildren } from "react"
import "./Container.scss"

interface Props extends PropsWithChildren{
    bp?:  "l" | "xl",
}

const Container = ({bp, children}: Props) => {
  return (
    <div className="container">
      <div className={`contained-content ${bp}`}>
        {children}
      </div>
    </div>
  )
}

export default Container