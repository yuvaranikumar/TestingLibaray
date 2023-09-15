import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { sp } from "@pnp/sp";
//getting list
export const getList = async () => {
  const source = await sp.web.lists.getByTitle("EmployeCode").items.getAll();
  console.log("list", source);
  return source;
};
//getting dynamic list
export const dynamicList = async () => {
  const source1 = await sp.web.lists.filter("BaseTemplate ne 101").get();
  console.log("dynamic", source1);
  return source1;
};
export const saveItemToList = async (listname, value) => {
  console.log("saveitems", listname, value);
  const listFolders = await sp.web.lists.getByTitle(listname).items.add({
    Title: value.EmpId,
    EmpName: value.Empname,
    EmpAddress: value.EmpAddress,
    ID: value.ID,
  });
  return listFolders;
};
export const updateItems = async (userID, value) => {
  const itemFolders = await sp.web.lists
    .getByTitle("EmployeCode")
    .items.getById(userID)
    .update({
      Title: value.EmpId,
      EmpName: value.Empname,
      EmpAddress: value.EmpAddress,
      ID: value.ID,
    });
  return itemFolders;
};

export const OnDelte = async (itemId, listname) => {
  const remove = await sp.web.lists
    .getByTitle(listname)
    .items.getById(itemId)
    .delete();
  return remove;
};

export const dropList = async (Listname) => {
  const sources = await sp.web.lists.getByTitle(Listname).items.getAll();
  console.log("list", sources);
  return sources;
};

export const getSearchList = async (query) => {
  const searchlist = await sp.web.lists
    .getByTitle("EmployeCode")
    .getItemsByCAMLQuery({
      ViewXml: `<View>
    <Query>
    <Where>
    <Contains>
    <FieldRef Name='EmpName'/>
    <Value Type='Text'>${query}</Value>
    </Contains>
    </Where>
    </Query>
    </View>`,
    });
  return searchlist;
};
