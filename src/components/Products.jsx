import ProductCard from "./ProductCard";
import { products } from "../data/products.js";

function Products() {
    return(
        <section id="productos" className="section">
            {/* Cada producto del arreglo se convierte en una tarjeta reutilizable. */}
            <div className="container">
                <div className="d-flex justify-content-between aling-items-end mb-4">
                    <div className="mb-0">Galeria de Productos

                    </div>

                </div>
                <div className="row g-4">
                    {products.map(
                        (prod)=>(
                            <div className="col-sm-6 col-md-4 col-lg-3" key={prod.id}>
                                {/* La clave permite a React identificar cada elemento de la lista. */}
                                <ProductCard product={prod}/>
                            </div>
                        )
                    )
                    }
                </div>    
            </div>    
        </section>    
    );
}

export default Products;