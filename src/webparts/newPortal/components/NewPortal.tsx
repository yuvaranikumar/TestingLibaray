import * as React from "react";
import {
  DefaultButton,
  DetailsList,
  Dropdown,
  IColumn,
  Label,
  Panel,
  PanelType,
  PrimaryButton,
  SearchBox,
  TextField,
} from "@fluentui/react";
import {
  OnDelte,
  dropList,
  dynamicList,
  getList,
  getSearchList,
  saveItemToList,
  updateItems,
} from "./portals";

const buttonStyles = { root: { marginRight: 8 } };

const Portals = (): React.ReactElement => {
  const [data, setdata] = React.useState([]);
  const [Ddata, setDdata] = React.useState([]);
  const [Dynamic, setDynamic] = React.useState([]);
  const [Fields, setFields] = React.useState({
    EmpId: "",
    Empname: "",
    EmpAddress: "",
    ID: "",
  });
  const [saveButton, setSaveButton] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selectedList, setSelectedList] = React.useState(null);
  const [dataIsopen, setDataisopen] = React.useState<boolean>(false);
  const[searchvalue,setSearchValue]=React.useState([])
  const[orginaldata,setOriginaldata]=React.useState([])
  React.useEffect(() => {
    onGetData();
    onDynamiclist();
  }, []);

  const onGetData = (): void => {
    getList().then((data1) => {
      console.log("data", data1);
      setdata(data1);
    });
  };

  const onDynamiclist = (): void => {
    dynamicList().then((datum) => {
      const ChoiceData = datum.map((item) => ({
        key: item.Id,
        text: item.Title,
      }));
      console.log(ChoiceData, "cc");
      setDdata(ChoiceData);
    });
  };

  const columns: IColumn[] = [
    {
      key: "column1",
      name: "EmployeeID",
      ariaLabel: "Column operations for File type, Press to sort on File type",
      fieldName: "Title",
      minWidth: 70,
      maxWidth: 80,
      onRender: (item) => <p>{item.Title}</p>,
    },
    {
      key: "column2",
      name: "EmployeName",
      ariaLabel: "EmpName",
      fieldName: "EmpName",
      minWidth: 80,
      maxWidth: 150,
      onRender: (item) => <p>{item.EmpName}</p>,
    },
    {
      key: "column3",
      name: "EmployeAddress",
      ariaLabel: "EmployeAdress",
      fieldName: "EmpAddress",
      minWidth: 70,
      maxWidth: 80,
      onRender: (item) => <p>{item.EmpAddress}</p>,
    },
    {
      key: "column4",
      name: "EmployeID",
      ariaLabel: "EmployeID",
      fieldName: "ID",
      minWidth: 70,
      maxWidth: 80,
      onRender: (item) => <p>{item.ID}</p>,
    },
    {
      key: "column5",
      name: "Edit",
      ariaLabel: "Edit",
      fieldName: "Edit",
      minWidth: 70,
      maxWidth: 80,
      onRender: (item) => (
        <PrimaryButton
          text="Updates"
          onClick={() => {
            console.log("item", item);
            setFields({
              EmpId: item.Title,
              Empname: item.EmpName,
              EmpAddress: item.EmpAddress,
              ID: item.Id,
            });
            setSaveButton(false);
            setIsOpen(true);
          }}
        />
      ),
    },
    {
      key: "column6",
      name: "delete",
      ariaLabel: "delete",
      fieldName: "delete",
      minWidth: 70,
      maxWidth: 80,
      onRender: (item) => (
        <PrimaryButton
          text="Delete"
          onClick={() => {
            onremove(item.Id);
            alert("Are u sure wanna delete");
          }}
        />
      ),
    },
  ];

  const OnSave = () => {
    console.log(Fields, "saveitems");
    if (Fields.EmpId && Fields.Empname && Fields.EmpAddress && Fields.ID) {
      saveItemToList("EmployeCode", Fields).then((data) => {
        console.log("save data successfully");
        setIsOpen(false);
        onGetData();
      });
    }
  };

  const onUpdate = () => {
    updateItems(Fields.ID, Fields).then((data) => {
      console.log(data, "useid");
      onGetData();
      setIsOpen(false);
    });
  };
  const onremove = (itemId) => {
    OnDelte(itemId, "EmployeCode").then((data) => {
      onGetData();
    });
  };

  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        {saveButton ? (
          <PrimaryButton onClick={OnSave} styles={buttonStyles}>
            Save
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={onUpdate} styles={buttonStyles}>
            Update
          </PrimaryButton>
        )}
        <DefaultButton
          onClick={() => {
            setIsOpen(false);
          }}
          styles={buttonStyles}
        >
          Cancel
        </DefaultButton>
      </div>
    ),
    [OnSave, onUpdate]
  );

  const OnchangeHandler = (ev, fields) => {
    let empval = ev.target.value;
    setFields((prevState) => ({ ...prevState, [fields]: empval }));
  };

  const ondropDownCLick = (options) => {
    console.log("Dropdown clicked with key:", options);
    setSelectedList(options.key);
    dropList(options.text).then((data) => {
      console.log("Data received from dropList:", data[0]);
      setDynamic(data);
    });
    setDataisopen(true);
  };

  const onserachnewvalue=(e)=>{
    const value=e.target.value;
    setSearchValue(value);
    console.log("serachvalue",value)
    if(searchvalue.length>=0){
    getSearchList(value).then((serachResult)=>{
        console.log("result",serachResult)
        setdata(serachResult)
    })
  }
  else{
   onGetData()
  }
}
     
    
  return (
    <div>
      <div className="List">
        <div className="Table">
          <DetailsList
            items={data}
            columns={columns}
            setKey="none"
            isHeaderVisible={true}
          />
          <PrimaryButton
            text="create"
            styles={buttonStyles}
            onClick={() => {
              setFields({
                EmpId: "",
                Empname: "",
                EmpAddress: "",
                ID: "",
              });
              setIsOpen(true);
              setSaveButton(true);
            }}
          />
          <Panel
            isOpen={isOpen}
            onDismiss={() => {
              setIsOpen(false);
            }}
            headerText="Admission Form"
            onRenderFooterContent={onRenderFooterContent}
            isFooterAtBottom={true}
          >
            <TextField
              label="Employee Id"
              placeholder="Enter the employee id"
              onChange={(ev) => {
                OnchangeHandler(ev, "EmpId");
              }}
              value={Fields?.EmpId}
            />
            <TextField
              label="Employee Name"
              placeholder="Enter the employee name"
              onChange={(ev) => {
                OnchangeHandler(ev, "Empname");
              }}
              value={Fields?.Empname}
            />
            <TextField
              label="Employee Address"
              placeholder="Enter the employee address"
              onChange={(ev) => {
                OnchangeHandler(ev, "EmpAddress");
              }}
              value={Fields?.EmpAddress}
            />
            <TextField
              label="Employee ID"
              placeholder="Enter the ID"
              onChange={(ev) => {
                OnchangeHandler(ev, "ID");
              }}
              value={Fields?.ID}
            />
          </Panel>
        </div>
      </div>

      <div className="Dropdown">
        <Dropdown
          placeholder="Select an item"
          label="Select an item:"
          //selectedKey={selectedItem ? selectedItem.key : undefined}
          options={Ddata}
          onChange={(ev, options) => {
            ondropDownCLick(options);
          }}
        />
      </div>
      <div className="drop">
        {selectedList ? (
          <Panel
            isOpen={dataIsopen}
            type={PanelType.custom}
            customWidth="70%"
            onDismiss={() => {
              setDataisopen(false);
            }}
          >
            <DetailsList
              items={Dynamic}
              //columns={colums}
              setKey="none"
              isHeaderVisible={true}
              //selectionMode={SelectionMode.single}
              //selection={selectionDetails}
            />
          </Panel>
        ) : (
          ""
        )}
      </div>
      <div className="Serachbox">
        <Label>Searchbox </Label>
        <SearchBox
         placeholder="Search" 
         //value={searchvalue}
         onChange={(newValue)=>onserachnewvalue(newValue)}
         styles={{
          root: {
            width: "300px",
          },
        }}
         />
      </div>
    </div>
  );
};
export default Portals;
