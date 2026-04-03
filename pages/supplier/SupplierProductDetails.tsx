import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Edit, Trash2, ExternalLink, Activity, Warehouse, BarChart3, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { 
  Card, Button, Badge, CardHeader, Table, THead, TBody, TR, TH, TD
} from '../../components/ui';
import { useSupplier } from '../../context/SupplierContext';

const SupplierProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, deleteProduct } = useSupplier();

  const product = useMemo(() => {
    return products.find(p => p.id === id);
  }, [products, id]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="p-4 bg-slate-100 rounded-full">
          <Package className="h-12 w-12 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <Link to="/supplier/products">
          <Button variant="primary">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        deleteProduct(product.id);
        navigate('/supplier/products');
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/supplier/products" className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm hover:shadow-md">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{product.name}</h1>
              <p className="text-slate-500 font-medium mt-1">Product ID: {product.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" icon={<Edit className="h-4 w-4" />}>Edit Product</Button>
            <Button 
              variant="ghost" 
              className="text-rose-600 hover:bg-rose-50 font-bold" 
              icon={<Trash2 className="h-4 w-4" />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-5">
          {/* Product Info Card */}
          <Card className="p-8">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="w-full md:w-64 h-64 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 border border-slate-100 overflow-hidden group">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                ) : (
                  <Package className="h-24 w-24" />
                )}
              </div>
              <div className="flex-1 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{product.name}</h2>
                    <Badge variant={product.status === 'Active' ? 'success' : 'warning'} className="font-bold">
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">SKU: {product.sku}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</p>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {product.name} is a premium product in the {product.category} category. 
                    It features high-quality materials and is designed for maximum performance and durability.
                    Flavour profile: {product.flavour || 'N/A'}.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-5 border-t border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</p>
                    <p className="text-sm font-black text-slate-900">{product.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</p>
                    <p className="text-sm font-black text-indigo-600">£{product.price.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Stock</p>
                    <p className="text-sm font-black text-slate-900">{product.stock.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MRP</p>
                    <p className="text-sm font-black text-slate-900">£{product.mrp.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Inventory Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Inventory by Warehouse</h3>
                <p className="text-sm text-slate-500 font-medium">Current stock distribution across FBU network</p>
              </div>
              <Button variant="secondary" size="sm" icon={<Warehouse className="h-4 w-4" />}>Transfer Stock</Button>
            </div>
            <Table>
              <THead>
                <TR>
                  <TH className="pl-8">Warehouse</TH>
                  <TH>Total Stock</TH>
                  <TH>Reserved</TH>
                  <TH>Available</TH>
                  <TH align="right" className="pr-8">Status</TH>
                </TR>
              </THead>
              <TBody>
                {[
                  { name: 'London Hub', stock: Math.floor(product.stock * 0.6), reserved: 15, available: Math.floor(product.stock * 0.6) - 15, status: 'Active' },
                  { name: 'Manchester North', stock: Math.floor(product.stock * 0.3), reserved: 5, available: Math.floor(product.stock * 0.3) - 5, status: 'Active' },
                  { name: 'Birmingham Logistics', stock: Math.floor(product.stock * 0.1), reserved: 0, available: Math.floor(product.stock * 0.1), status: product.stock < 100 ? 'Low Stock' : 'Active' },
                ].map((wh, i) => (
                  <TR key={i} className="hover:bg-slate-50/50 transition-colors">
                    <TD className="pl-8 font-bold text-slate-900">{wh.name}</TD>
                    <TD className="font-black text-slate-900 tabular-nums">{wh.stock.toLocaleString()}</TD>
                    <TD className="text-slate-500 tabular-nums">{wh.reserved}</TD>
                    <TD className="font-black text-indigo-600 tabular-nums">{wh.available.toLocaleString()}</TD>
                    <TD align="right" className="pr-8">
                      <Badge variant={wh.status === 'Active' ? 'success' : 'warning'} className="font-bold">{wh.status}</Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="p-8 space-y-5">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Quick Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white rounded-xl text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Sold</span>
                </div>
                <span className="text-lg font-black text-slate-900 tabular-nums">1,240</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white rounded-xl text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Accuracy</span>
                </div>
                <span className="text-lg font-black text-slate-900 tabular-nums">99.8%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white rounded-xl text-amber-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Zap className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lead Time</span>
                </div>
                <span className="text-lg font-black text-slate-900 tabular-nums">1.2d</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full h-12 rounded-xl font-bold" icon={<ExternalLink className="h-4 w-4" />}>View on Storefront</Button>
          </Card>

          <Card className="p-8 bg-indigo-600 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Package className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-lg font-bold">Supplier Support</h3>
              <p className="text-sm font-medium opacity-90 leading-relaxed">
                Need help with this product? Contact your FBU account manager for inventory reconciliation or listing updates.
              </p>
              <Button variant="primary" className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none h-12 rounded-xl font-bold">Contact Support</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierProductDetails;
