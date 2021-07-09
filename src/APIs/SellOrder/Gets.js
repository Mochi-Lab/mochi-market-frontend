import axios from 'axios';

export const getSellOrderByPage = async (skip, page) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER}/sellOrder/all?skip=${skip}&limit=${page}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};

export const getavailableSellOrderERC721 = async (skip, page) => {
  let result = await axios
    .get(
      `${process.env.REACT_APP_SERVER}/sellOrder/availableSellOrderERC721?skip=${skip}&limit=${page}`
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};

export const getavailableSellOrderERC1155 = async (skip, page) => {
  let result = await axios
    .get(
      `${process.env.REACT_APP_SERVER}/sellOrder/availableSellOrderERC1155?skip=${skip}&limit=${page}`
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};
