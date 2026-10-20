import * as XLSX from 'xlsx';
import{saveAs} from 'file-saver';
import { products } from '../data/products';

function DataTable(){
     

 const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
 const workbook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
 const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
 const data= new Blob([excelBuffer], {type:"application/octet-stream"});
 saveAs(data, 'productos.xlsx');

}

    return(

        <section className='section'>
            <div className='container'>
                <header className='mb-4'>  Tabla Productos </header>
                <table className='table table-striped'>
                 <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                    </tr>
                 </thead> 
                 <tbody>
                    
                </tbody>  
                </table>
            </div>
        </section>
            

    )    

}

export default DataTable