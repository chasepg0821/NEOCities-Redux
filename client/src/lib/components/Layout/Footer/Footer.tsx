import "./Footer.scss";

type Props = {};

const Footer = (props: Props) => {
    return (
        <footer>
            <div className="org-card-container">
                <div className="org-card">
                    <h4>BIG CAT Research Group</h4>
                    <hr />
                    <p>
                        Building Intelligent Goals for Collaborative AI
                        Technologies
                    </p>
                </div>
                <div className="org-card">
                    <h4>Trace Research Group</h4>
                    <hr />
                    <p>
                        Team Research and Analytics in Computation Environments
                    </p>
                </div>
                <div className="org-card">
                    <h4>CU-CHAI</h4>
                    <hr />
                    <p>
                      Clemson University Center for Human-AI Interaction, Collaboration, and Teaming
                    </p>
                </div>
            </div>
            <hr />
            <div>
                <p>
                    &copy; {new Date().getFullYear()} CU-CHAI. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
