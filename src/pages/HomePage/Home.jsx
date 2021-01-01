import React from "react";
import styled from "styled-components";
import { AuthContext } from "../../components/Auth";
import ProjectCard from "../../components/project-card/project-list";
import { firestore } from "../../firebase/firebase";
import PreLoader from "../../shared/components/preloader/preloader";
import Footer from "../../components/footer/Footer";

class Home extends React.Component {
  static contextType = AuthContext;

  constructor() {
    super();
    this.state = {
      projects: [],
      isPending: true,
    };
  }

  componentDidMount() {
    let { currentUser } = this.context;

    this.unsub = firestore
      .collectionGroup("members")
      .where("id", "==", currentUser.id)
      .onSnapshot((snapshot) => {
        if (snapshot.size) {
          var allProjects = [];
          var promises = [];

          snapshot.forEach((doc) => {
            promises.push(
              firestore
                .collection("projects")
                .doc(doc.data().projectId)
                .get()
                .then((project) => {
                  if (project.data().isDeleted !== true) {
                    return {
                      id: project.id,
                      ...project.data(),
                      role: doc.data().role,
                    };
                  } else return null;
                })
            );
          });
          Promise.all(promises)
            .then((fullFilledData) => {
              fullFilledData.forEach((project) => {
                if (project) {
                  allProjects.push(project);
                }
              });
            })
            .then(() =>
              this.setState({ projects: allProjects, isPending: false })
            );
        } else {
          this.setState({ isPending: false });
        }
      });
  }
  componentWillUnmount() {
    // Detach listener
    this.unsub();
  }
  render() {
    return this.state.isPending ? (
      <PreLoader />
    ) : (
      <div>
        {this.state.projects.length > 0 ? (
          <HomeWrapper>
            {this.state.projects.map((project) => {
              return <ProjectCard key={project.id} project={project} />;
            })}
          </HomeWrapper>
        ) : (
          <NoProject>
            <h1>¯\_(ツ)_/¯</h1>
            <h5>You do not have any ongoing projects right now</h5>
            <p>
              You can always create one with the <a href="/newproject">New Project</a> button on the
              navigation bar at the top :)
            </p>
          </NoProject>
        )}
        <Footer></Footer>
      </div>
    );
  }
}
export default Home;

const HomeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  text-align:center;
  width:100%;
  min-height: 100vh;
  justify-content: flex-start;
  margin: 0 auto;
  & > div {
    margin: 10px 10px;
  }
`;
const NoProject = styled.div`
  min-height: 100vh;
  align-items: center;
  text-align: center;
  & > h5 {
    font-size: 1.5rem;
    color: #263842;
  }
  a {
    color: #578CA9;
    font-weight:bold;
  }
`;
