
import "./Footer.scss"

type Props = {}

const Footer = (props: Props) => {

  return (
    <footer>
      <div>
        <h4>BIG CAT Research Group</h4>
        <p>Building Intelligent Goals for Collaborative AI Technologies</p>
      </div>
      <hr />
      <div>
        <p>&copy; {new Date().getFullYear()} BIG CAT RG. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer