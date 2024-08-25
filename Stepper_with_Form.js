import React, { useEffect, useState } from "react";
import "./Msv_one.scss";
import activepageimg from "../../../Assets/images/active-page-star.svg";

function App() {
  const formArray = [1, 2, 3, 4, 5];
  const [formNo, setFormNo] = useState(formArray[0]);
  const [state, setState] = useState({
    name: "",
    varsity: "",
    district: "",
    a: "",
    b: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const pre = () => {
    if (formNo === 1) return;

    setFormNo(formNo - 1);
  };

  const next = () => {
    if (formNo === 1 && state.name) {
      setFormNo(formNo + 1);
    } else if (formNo === 2 && state.varsity) {
      setFormNo(formNo + 1);
    } else if (formNo === 3 && state.b) {
      setFormNo(formNo + 1);
    } else if (formNo === 4 && state.a) {
      setFormNo(formNo + 1);
    } else {
      alert("Please fill up all input fields");
    }
  };

  const finalSubmit = () => {
    if (state.district) {
      localStorage.removeItem("formDraft");
      alert("Form submitted successfully");
    } else {
      alert("Please fill up all input fields..");
    }
  };

  const saveDraft = () => {
    localStorage.setItem("formDraft", JSON.stringify(state));
    alert("Draft saved successfully");
  };

  const getDraftData = () => {
    const draftData = localStorage.getItem("formDraft");
    if (draftData) {
      setState(JSON.parse(draftData));
    }
  };

  useEffect(() => {
    getDraftData();
  }, []);

  return (
    <div className="msvOne">
      <div className="msvOne__steps">
        {formArray.map((v, i) => (
          <>
            <div
              className={`msvOne__circle ${
                i < formNo - 1 || i === formNo - 1
                  ? "msvOne__active-border"
                  : "msvOne__inactive-border"
              }`}
            >
              {formNo === i + 1 && (
                <img src={activepageimg} alt={`Step ${v}`} />
              )}
              {formNo !== i + 1 && v}
            </div>
            {i !== formArray.length - 1 && (
              <div
                className={`msvOne__line ${
                  i < formNo - 1 && formNo !== formArray.length + 1
                    ? "msvOne__active-line"
                    : "msvOne__inactive-line"
                }`}
              ></div>
            )}
          </>
        ))}
      </div>

      <div className="msvOne__forms">
        {formNo === 1 && (
          <div>
            <div>
              <label htmlFor="name">Name</label>
              <input
                value={state.name}
                onChange={inputHandle}
                type="text"
                name="name"
                placeholder="name"
                id="name"
              />
            </div>

            <div>
              <button onClick={pre}>Previous</button>
              <button onClick={next}>Next</button>
              <button onClick={saveDraft}>Save Draft</button>
            </div>
          </div>
        )}

        {formNo === 2 && (
          <div>
            <div>
              <label className="text-slate-500" htmlFor="varsity">
                Varsity
              </label>
              <input
                value={state.varsity}
                onChange={inputHandle}
                type="text"
                name="varsity"
                placeholder="varsity name"
                id="varsity"
              />
            </div>

            <div>
              <button onClick={pre}>Previous</button>
              <button onClick={next}>Next</button>
              <button onClick={saveDraft}>Save Draft</button>
            </div>
          </div>
        )}

        {formNo === 3 && (
          <div>
            <div>
              <label className="text-slate-500" htmlFor="b">
                b
              </label>
              <input
                value={state.b}
                onChange={inputHandle}
                type="text"
                name="b"
                placeholder="b name"
                id="b"
              />
            </div>

            <div>
              <button onClick={pre}>Previous</button>
              <button onClick={next}>Next</button>
              <button onClick={saveDraft}>Save Draft</button>
            </div>
          </div>
        )}

        {formNo === 4 && (
          <div>
            <div>
              <label className="text-slate-500" htmlFor="a">
                a
              </label>
              <input
                value={state.a}
                onChange={inputHandle}
                type="text"
                name="a"
                placeholder="a name"
                id="a"
              />
            </div>

            <div>
              <button onClick={pre}>Previous</button>
              <button onClick={next}>Next</button>
              <button onClick={saveDraft}>Save Draft</button>
            </div>
          </div>
        )}

        {formNo === 5 && (
          <div>
            <div>
              <label htmlFor="district">District</label>
              <input
                value={state.district}
                onChange={inputHandle}
                type="text"
                name="district"
                placeholder="district name"
                id="district"
              />
            </div>

            <div>
              <button onClick={pre}>Previous</button>
              <button onClick={finalSubmit}>Submit</button>
              <button onClick={saveDraft}>Save Draft</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

//  scss

// @import "../../../Assets/scss/variables.scss";

// .msvOne {
//   width: 100vw;
//   height: 100vh;
//   background-color: ghostwhite;
//   display: flex;
//   align-items: center;
//   flex-direction: column;

//   &__steps {
//     height: rem(35);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     padding-top: rem(30);
//   }

//   &__circle {
//     width: rem(35);
//     height: rem(35);
//     color: black; /* Set text color to black */
//     border-radius: 50%;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border: 2px solid transparent; /* Set initial border color to transparent */
//   }

//   &__active-border {
//     color: #f58f13;
//     border: 3px solid #f58f13; /* Set border color to blue */
//   }

//   &__inactive-border {
//     border: 3px solid #cad0db; /* Set border color to gray */
//   }

//   &__line {
//     width: rem(174);
//     height: rem(2);
//     transition: 0.5s ease;
//   }

//   &__active-line {
//     height: rem(1.809);
//     border: 0.5px solid #f58f13;
//     background: #f58f13;
//   }

//   &__inactive-line {
//     border: 0.3px solid #cad0db;
//     background: #cad0db;
//   }

//   &__forms {
//     padding-top: rem(35);
//   }
// }
