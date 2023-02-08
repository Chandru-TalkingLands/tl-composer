import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Map from "../Map/Map";

function Composer() {
  var Imageurl = `https://rdfolder.s3.ap-south-1.amazonaws.com/`;
  var countCards = -1;

  const [data, setData] = useState({
    title: "",
    img: "",
    description: "",
  });
  const [num, setnum] = useState(0);
  const [pushdata, setpushdata] = useState([]);
  const [coordinatepoint,setcoordinatepoint] = useState()
  const [bounds,setbounds] = useState()
  const [markerhide,setmarkerhide] = useState()

console.log("composer",markerhide)
  //handle image change
  const handleImage = async (e) => {
    e.preventDefault();
    let imgName = e.target.files[0];
    const formData = new FormData();
    formData.append("file", imgName);

    let property_name = "Mysore";
    let sub_folder = "Tales";
    let category_name = "Amenities";

    try {
      const res = await axios.post(
        `http://localhost:7000/upload/${property_name}/${sub_folder}/${category_name}`,
        formData
      );
      console.log(res.data);
      setData(() => ({
        ...data,
        img: res.data,
        // setnum,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  //handle Inputs data change
  const handleInputs = (e) => {
    let value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  //add story to array
  const handleAddstory = (e) => {
    e.preventDefault();
    var val = 0;
    // !data.img
    if (!data.coordinates[0] || !data.title  ) {
      alert("Please select marker and fill inputs");
    } else {
      setpushdata((prev) => [...prev, { ...data, id: uuidv4() }]);
      alert("Added Story");
      setData({
        title: "",
        img: "",
        description: "",
        coordinates:[]
      });
      setmarkerhide(false,num)
      val = num + 1;
      setnum(val);
      return val + 1;
    }
  };


  //handle push story or save story
  const handlesaveStory = async (e) => {
    e.preventDefault();
      let property_name = "Mysore";
      let sub_folder = "Tales";
      let category_name = "Amenities";
      console.log(pushdata, "dataaaa");
      axios
        .post(
          `http://localhost:7000/create/json/${property_name}/${sub_folder}/${category_name}`,
          pushdata
        )
        .then((res) => {
          console.log(res);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
      alert("Added all Stories");
  };


  //checking code for Inputs
  const handleeditInputs = (e, cards, counter) => {
    const newData = e.target.value;
    setData({
      ...data,
      coordinates:[coordinatepoint[0], coordinatepoint[1]],
      [e.target.name]: newData,
    });

    pushdata[counter] = {
      ...pushdata[counter],
      [e.target.name]: e.target.value,
    };
  };

  console.log(pushdata);

  //handle delete onClick
  const handleDelete = (e, object) => {
    e.preventDefault();
    let property_name = "Mysore";
    let sub_folder = "Tales";
    let category_name = "Amenities";
    let imgKey = object?.img;
    let imglength = imgKey.split("/").length;
    let file_key = imgKey.split("/")[imglength - 1];
    axios
      .delete(
        `http://localhost:7000/delete/file/${property_name}/${sub_folder}/${category_name}/${file_key}`
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
    let item = [];
    pushdata.filter((data) => {
      if (data.title != object.title) {
        item.push(data);
      }
    });
    setpushdata(item);
    console.log(pushdata);
    alert("Deleted Successfully");
  };

  //getting coordinates from map
  const getcoordinatepoint = (lat,lng,northbounds,southbounds)=>{
    setcoordinatepoint([lat,lng])
    setbounds({
      northbounds:northbounds,
      southbounds:southbounds
    })

   }


  // setting coordinates data
  useEffect(() => {
    if (coordinatepoint) {
      setData({
        ...data,
        coordinates: [coordinatepoint[0], coordinatepoint[1]],
        northbounds:bounds.northbounds,
        southbounds:bounds.southbounds
      });
    }
  }, [coordinatepoint]);

  //

  return (
    <div className="composer">
      <div className="container">
        <div className="container-sidebar">
          <form>
            <div className="top-row">
              <h2 className="top-title-form">Write a story</h2>
              <h4 className="add-story-btn" onClick={handleAddstory}>
                Add story
              </h4>
            </div>
            <div className="main-form-div">
              <div className="image-upload">
                {data.img == "" ? (
                  <img
                    className="upload-image-photo"
                    alt="Upload Image Logo"
                    src="https://i.ibb.co/C5xw58w/upload-icon-19.png"
                  />
                ) : (
                  <img
                    className="upload-image-photo"
                    alt="image"
                    src={Imageurl + data.img}
                  />
                )}
                <p className="allowed-text">
                  Allowed *jpeg, *jpg, *png max size of 3MB
                </p>
                <input
                  className="upload-btn"
                  width="500px"
                  type="file"
                  multiple={true}
                  name="img"
                  accept="image/*"
                  onChange={handleImage}
                />
              </div>
              <div className="text-input-area">
                <OutlinedInput
                  className="titleText"
                  name="title"
                  onChange={handleInputs}
                  placeholder="Story Title"
                  value={data.title}
                />
                <OutlinedInput
                  className="descriptionText"
                  rows={5}
                  multiline
                  type="textarea"
                  name="description"
                  onChange={handleInputs}
                  placeholder="Story Description"
                  value={data.description}
                />
                <button className="save-exit-btn" onClick={handlesaveStory}>Save & Exit</button>
              </div>
            </div>
          </form>
        </div>
        <div className="container-map">
          <Map getcoordinatepoint={getcoordinatepoint} markerhide={markerhide} num={num}/>
        </div>
      </div>

      <div className="card-preview">
        {pushdata.length > 0 ? (
          <>
            <div className="preview">
              {pushdata &&
                pushdata.map((d) => {
                  countCards = countCards + 1;
                  let counter = countCards;
                  return (
                    <div key={d.id}>
                      <div className="card">
                        <img className="card-img" src={Imageurl + d.img} />
                        <div className="card-title">
                          <input
                            type="text"
                            value={d.title}
                            className="hdr-card"
                            placeholder="Story Title"
                            name="title"
                            onChange={(e) => handleeditInputs(e, data, counter)}
                          />
                          <OutlinedInput
                            rows={5}
                            multiline
                            type="text"
                            className="card-story"
                            name="description"
                            value={d.description}
                            placeholder="This is yout TL Tales || Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                            onChange={(e) => handleeditInputs(e, data, counter)}
                          />
                        </div>
                        <div className="card-actions">
                          {/* <img className='card-icon-edit' onClick={editFun} src='https://i.ibb.co/gwMddh7/pencil.png'/> */}
                          <img
                            className="card-icon-delete"
                            src="https://i.ibb.co/ymCBkTK/trash-1.png"
                            onClick={(e) => handleDelete(e, d)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      
    </div>
  );
}
export default Composer;
