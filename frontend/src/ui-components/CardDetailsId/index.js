import React from "react";
import styles from "./styles.module.css";

import ActionButton from "../ActionButton";
import Card from "../Card";
import { SlCalender } from "react-icons/sl";
import Modal from "../Modal";
import Toggle from "../Toggle";

import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { useRecoilValue } from "recoil";
import { addressState } from "../../../atoms/addressAtom";
import ChildAbi from "../../../utils/childABI.json";
import DateMint from "../DateMint";
import axios from "axios";

const CardDetailsId = ({ classId, image }) => {
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [mentorAddress, setMentorAddress] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [showId, setShowId] = useState("");
  const [showUri, setShowUri] = useState("");
  const [detail, setDetail] = useState({});
  const [students, setStudents] = useState("");
  const [trueStatus, setTrueStatus] = useState("");
  const [children, setChildren] = useState();
  const [width, setWidth] = useState(null);
  const [modal, setModal] = useState(false);
  const [classid, setClassId] = useState();
  const programAddress = useRecoilValue(addressState);

  const handleClose = () => {
    //alert('closing');
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
  };

  const handleSubmit = () => {
    toast.success("Submitted");
    handleClose();
  };

  const { data: lectureData, isLoading: lectureDataIsLoading } =
    useContractRead({
      address: programAddress,
      abi: ChildAbi,
      functionName: "getLectureData",
      args: [classId],
    });

  const { data: userName } = useContractRead({
    address: programAddress,
    abi: ChildAbi,
    functionName: "getMentorsName",
    args: [mentorAddress],
  });

  console.log("mentor", mentorAddress);

  useEffect(() => {
    const handleCardNFT = (showUri) => {
      const mainNFT =
        showUri?.length == 59
          ? `${showUri}`
          : `bafyreib2rkokdxhwczaz7gepaczq4y7znkxrddeqhvdevoxkilwszajjiy`;

      fetchDetail(`https://ipfs.io/ipfs/${mainNFT}/metadata.json`);
    };

    async function fetchDetail(data) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios.get(data, config).then((res) => setDetail(res.data));
    }

    setHeading(lectureData?.topic);
    setMentorAddress(lectureData?.mentorOnDuty);
    setCardDate(lectureData?.attendanceStartTime);
    setShowUri(lectureData?.uri);
    setStudents(lectureData?.studentsPresent);
    setTrueStatus(lectureData?.status);
    setClassId(classId);
    setShowId(classId);
    setMentorName(userName);
    setSubHeading(lectureData?.topic);
    handleCardNFT(showUri);
  }, [lectureData, userName, showUri, detail]);

  console.log("detail", detail);

  let imageUrl = `https://ipfs.io/ipfs/${detail.image?.slice(7)}`;

  return (
    <div>
      <Card
        heading={`Topic: ${heading}`}
        subHeading={`Description: ${subHeading}`}
        rightItem={() => {
          return <h2>{mentorName}</h2>;
        }}
        footerLeft={() => {
          return (
            <div className={styles["date-placeholder"]}>
              <SlCalender />
              <p className="ml-5">
                <DateMint cardDate={cardDate} />
              </p>
              <p className=" ml-7">NFT ID: {showId.toString()}</p>
            </div>
          );
        }}
        footerRight={() => {
          return (
            <ActionButton
              onClick={() => setModal(true)}
              inverse={true}
              label="View"
              style={{ padding: "2px 5px", fontSize: 12 }}
            />
          );
        }}
      >
        <div
          style={{
            margin: "10px",
          }}
        >
          <div className=" bg-[#FFFFFF] p-4 rounded-lg w-full h-full items-center justify-center">
            <div className=" rounded-lg ">
              <img
                src={imageUrl}
                className="rounded-lg object-cover w-screen h-60"
              />
            </div>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={modal}
        onClose={handleClose}
        heading={"Attendance Card Details"}
        positiveText={"Save Changes"}
        negativeText={"Classmate+"}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      >
        <div className=" bg-inherit p-4 rounded-lg w-full h-full flex flex-col items-center justify-center">
          <div className=" rounded-lg ">
            <img
              src={imageUrl}
              width={500}
              height={500}
              className="rounded-lg object-cover w-screen h-60"
            />
          </div>
          <div className="flex items-center justify-between w-full h-full text-black font-semibold text-center">
            <div>
              <div className="flex items-center justify-center my-1 py-1 text-lg ">
                <SlCalender />
                <p className="ml-3">
                  <DateMint cardDate={cardDate} />
                </p>
              </div>
              <p className=" my-1 py-1 text-lg ">{heading}</p>
              <p className="my-1 py-1 text-lg ">{showId.toString()}</p>
            </div>
            <div>
              <p className="my-1 py-1 text-lg ">{students}</p>
              <p className="my-1 py-1 text-lg ">{trueStatus}</p>
              <div>
                <Toggle />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CardDetailsId;
