import React from "react";
import dayjs from "dayjs";

export default function Root(props: VitalParcelProps) {
 
const [vitals, setVitals] = React.useState(null);

  React.useEffect(() => {
    const queryParams = `
    custom:(uuid,encounterDatetime,obs:(id,uuid,value,concept:(id,uuid,name:(display),datatype:(uuid)),
    groupMembers:(id,uuid,display,value,concept:(id,uuid,name:(display),datatype:(uuid))))
    `.replace(/\s/g, "");

    fetch(`/openmrs/ws/rest/v1/encounter?patient=${props.patientUuid}&encounterType=67a71486-1a54-468f-ac3e-7091a9a79584&v=${queryParams}`)
      .then(resp => {
        if (resp.ok) {
          //console.log(resp.json());
          return resp.json();
        } else {
          throw Error(
            `Cannot fetch vitals ${props.patientUuid} - server responded with '${resp.status}'`
          );
        }
      })
      .then(vitals => {
        setVitals(vitals);
      });
  }, []);

  return vitals ? renderVitals() : renderLoader();

  function renderLoader() {
    return <div>Loading...</div>;
  }

  function renderVitals(){
      console.log(vitals);
       let obs = [];
      vitals.results.forEach(vital => {
        console.log(vital.encounterDatetime);
       obs =   vital.obs;
       console.log(obs);
       //obs
      });
    
    return (
      <div>     
        <div>
          <h2>PATIENT VITALS</h2>
          <h4>
              Encounter Date :{" "}
              {dayjs(vitals.results[0].encounterDatetime).format("YYYY-MM-DD")}
          </h4>
        </div>
        <div>
        {obs.map((item,i)=>{        
          return(
            <table key={i}>
              <thead>
                <tr>
                  <th>{item.concept.name.display}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{item.value}</td>
                </tr>
              </tbody>
            </table>
          );
          })}
        </div>         
      </div>
    );
  }  
}

type VitalParcelProps = {
  patientUuid: string;
};

type vitalsToShow ={
  name:string;
  value:string
}
type RootProps = {};

