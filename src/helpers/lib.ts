

 export const bool = (value) => {
        const dt = {"True": true, "False": false};
        return dt[value];
  }



export const print = ({...data}) => {
      return console.log(data);
}