const dataset = [
    { id: "001", name: "aaa" },
    { id: "002", name: "bbb" },
    { id: "003", name: "ccc" },
    { id: "004", name: "aaa" },
  ];
  
  const newDataset = dataset.filter(data => data.name === "aaa");
  
  // 出力
  console.log(newDataset);
  console.log(dataset)