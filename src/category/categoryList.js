import React, { useState,useEffect } from 'react'
import MaterialTable from 'material-table'
import { getAllCategory,deleteCategory } from './../services/categoryService'
import { Button,Spinner } from 'react-bootstrap'
import './categoryList.css'
import CategoryForm from './categoryForm'
import Snackbar from '@material-ui/core/Snackbar'
import NavBar from './../components/navBar'
export const CategoryList = (props) => {
    const [categoryList, setCategoryList] = useState(null)
    const [modalShow, setModalShow] = useState(false)
    const [isEditCategory, setIsEditCategory] = useState(false)
    const [editCategory, setEditCategory] = useState([])
    const [dbError,setDbError] = useState(false)
    const [snackBarOpen,setSnackBarOpen] = useState(false)
    const handleCloseSnack=()=>{
        setSnackBarOpen(false)
    }
    const columns= [{ title: "Category Name", field: 'name' },
        {
            title: "Is Active", field: 'isActive',
            render: rowData => {
                if (rowData.isActive) {
                        return (
                            <p style={{ color: 'green', fontWeight: "bolder" }}>Active</p>
                                 )
                }
                else {
                    return (
                        <p style={{ color: 'red', fontWeight: "bolder" }}>InActive</p>
                            )
                }
            }
        },
    ]


const modalOpen=()=> {

   setModalShow(true)

}
const modalClose=()=> {
    setModalShow(false)
    setIsEditCategory(false)

}
const onSave = async () => {
   setModalShow(false)
   getCategory()

}

const editActive=(data)=> {
    setEditCategory(data)
    console.log(data)
    setIsEditCategory(true)
    setModalShow(true)

}
// const view=()=> {
//     console.log('DB List', categoryList)
//     console.log('Edit List',editCategory)
//     console.log('isEdit', isEditCategory)
// }
const getCategory=async()=>{
    const data = await getAllCategory()
   if(data){
    setCategoryList(data)
    
   }
   else{
       setDbError(true)
   }
}
useEffect(()=>{
    getCategory()
    setDbError(false)
    setSnackBarOpen(false)
 // eslint-disable-next-line react-hooks/exhaustive-deps      
},[props])

    return (
        <div>
            <NavBar></NavBar>
            {categoryList?

                <div>
                    <Button style={{margin:'10px 30px'}} onClick={() => modalOpen()}>Add Category</Button>
{categoryList &&
    <div className='table'>
        <MaterialTable style={{ marginTop: '15px' }} title="Category" data={categoryList}
            columns={columns}
            actions={[
                {
                    icon: 'edit',
                    tooltip: 'Edit User',
                    onClick: async (event, rowData) => {
                        editActive(rowData)
                    }
                },
            ]}
            editable={{
                onRowDelete: selectedRow => new Promise(async (resolve, reject) => {
                    const id = selectedRow._id
                    const data = await deleteCategory(id)
                    if(data){
                        setSnackBarOpen(true)
                        setTimeout(() => {
                            getCategory()
                            resolve()
                        }, 2000);
                        
                    }
                }),
            }}
            options={{
                actionsColumnIndex: -1,
                showFirstLastPageButtons: false,
                pageSizeOptions: [5, 10, 20, 50]
            }}
        >
        </MaterialTable>
    </div>
}

<CategoryForm
    onHide={() => {
        modalClose()
    }}
    show={modalShow}
    onSave={() => {onSave() }}
    isEdit={isEditCategory}
    editCategory={editCategory}
></CategoryForm>
<Snackbar open={snackBarOpen} message="Successfully Deleted" 
            autoHideDuration={3500} onClose={handleCloseSnack}>
       
       </Snackbar>
                </div>
: 
dbError ? 
<div style={{width:'100%',height:'100px',marginTop:'300px'}} >

<p style={{display:'block',marginLeft:'auto',
marginRight:'auto',textAlign:'center'}}>Looks like Server Down!!
<br/><a href="/category">
Try Reloading the page
</a></p>

</div>
:
<div style={{width:'100%',height:'100px',marginTop:'300px'}} >
<Spinner  style={{display:'block',marginLeft:'auto',
marginRight:'auto',height:'50px',width:'50px'}} animation="border" variant="primary" />
<p style={{display:'block',marginLeft:'auto',
marginRight:'auto',textAlign:'center'}}>Loading</p>
</div>
        
            }
        </div>
    )

}
export default CategoryList