import axios from "axios";

export const getChatId = async () => {
  const res = await axios.get(
    `https://api.telegram.org/bot7349413874:AAGC5Vqj5jdsArOIG1KsEvxZissfsHfdkBI/getUpdates`
  );
  console.log("TELEGRAM", res.data);
  return res.data?.result[0]?.message?.chat?.id;
};

export const sendMessage = async (message: string) => {
  const res = await axios.get(
    `https://api.telegram.org/bot7349413874:AAGC5Vqj5jdsArOIG1KsEvxZissfsHfdkBI/sendMessage?chat_id=-4851468671&text=${message}`
  );
  console.log(res.data);
};
