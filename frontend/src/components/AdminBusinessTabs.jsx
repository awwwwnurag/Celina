import React from 'react';
import { ArrowLeftRight, RefreshCw, XCircle, CheckCircle2, Eye, BarChart2, AlertTriangle, Package, Download, FileUp, Barcode, Zap, Wallet } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Returns & Exchanges Tab
// ─────────────────────────────────────────────────────────────────────────────
export const ReturnsTab = ({
  returnRequests, returnsLoading, returnFilter, setReturnFilter, loadReturnRequests,
  selectedReturn, setSelectedReturn, returnAdminNote, setReturnAdminNote,
  returnRefundMethod, setReturnRefundMethod, returnRefundAmount, setReturnRefundAmount,
  handleUpdateReturn
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
        <ArrowLeftRight size={20} /> Returns, Exchanges & Cancellations
      </h2>
      <button onClick={loadReturnRequests} className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-black transition">
        <RefreshCw size={13} /> Refresh
      </button>
    </div>

    <div className="flex flex-wrap gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <select value={returnFilter.status} onChange={e => setReturnFilter(f => ({ ...f, status: e.target.value }))} className="border border-gray-300 text-sm rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-gray-900">
        <option value="">All Statuses</option>
        {['Pending', 'Approved', 'Rejected', 'Completed', 'Refunded'].map(s => <option key={s}>{s}</option>)}
      </select>
      <select value={returnFilter.type} onChange={e => setReturnFilter(f => ({ ...f, type: e.target.value }))} className="border border-gray-300 text-sm rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-gray-900">
        <option value="">All Types</option>
        {['Return', 'Exchange', 'Cancellation'].map(t => <option key={t}>{t}</option>)}
      </select>
      <button onClick={loadReturnRequests} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition">Apply Filter</button>
    </div>

    {selectedReturn && (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-black text-lg uppercase">Request #{selectedReturn._id?.slice(-8)}</h3>
            <p className="text-sm text-gray-500">{selectedReturn.type} &middot; {selectedReturn.reason}</p>
          </div>
          <button onClick={() => setSelectedReturn(null)} className="text-gray-400 hover:text-red-500 transition"><XCircle size={20} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Customer</p>
            <p className="font-semibold">{selectedReturn.user?.name}</p>
            <p className="text-sm text-gray-500">{selectedReturn.user?.email}</p>
            <p className="text-sm text-green-600 font-bold mt-1">Store Credit: ₹{selectedReturn.user?.storeCredit || 0}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Items Requested</p>
            {selectedReturn.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded bg-gray-100" />
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} &middot; ₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Update Status</label>
              <select value={selectedReturn.status} onChange={e => setSelectedReturn(r => ({ ...r, status: e.target.value }))} className="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-gray-900">
                {['Pending', 'Approved', 'Rejected', 'Completed', 'Refunded'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Refund Method</label>
              <select value={returnRefundMethod} onChange={e => setReturnRefundMethod(e.target.value)} className="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-gray-900">
                <option value="None">None</option>
                <option value="StoreCredit">Store Credit</option>
                <option value="OriginalPayment">Original Payment</option>
                <option value="Manual">Manual (Bank Transfer)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Refund Amount (₹)</label>
              <input type="number" value={returnRefundAmount} onChange={e => setReturnRefundAmount(Number(e.target.value))} className="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900" placeholder="0" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Admin Note</label>
              <input type="text" value={returnAdminNote} onChange={e => setReturnAdminNote(e.target.value)} className="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900" placeholder="Internal note..." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => handleUpdateReturn(selectedReturn._id)} className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition flex items-center gap-2">
              <CheckCircle2 size={14} /> Save Changes
            </button>
            <button onClick={() => setSelectedReturn(null)} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition">Cancel</button>
          </div>
        </div>
      </div>
    )}

    {returnsLoading ? (
      <div className="py-12 text-center text-gray-400">Loading requests...</div>
    ) : (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>{['ID', 'Customer', 'Type', 'Reason', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {returnRequests.map(r => (
                <tr key={r._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">#{r._id?.slice(-8)}</td>
                  <td className="px-4 py-3"><p className="font-semibold">{r.user?.name}</p><p className="text-xs text-gray-400">{r.user?.email}</p></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${r.type === 'Return' ? 'bg-blue-100 text-blue-700' : r.type === 'Exchange' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{r.type}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[140px] truncate">{r.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${r.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : r.status === 'Approved' ? 'bg-green-100 text-green-700' : r.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setSelectedReturn(r); setReturnAdminNote(r.adminNote || ''); setReturnRefundMethod(r.refundMethod || 'None'); setReturnRefundAmount(r.refundAmount || 0); }} className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black transition">
                      <Eye size={12} /> Review
                    </button>
                  </td>
                </tr>
              ))}
              {returnRequests.length === 0 && (
                <tr><td colSpan="7" className="py-10 text-center text-gray-400 italic">No return requests yet. Click Refresh to load.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Inventory Report Tab
// ─────────────────────────────────────────────────────────────────────────────
export const InventoryTab = ({ inventoryReport, inventoryLoading, inventoryFilter, setInventoryFilter, loadInventoryReport }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 flex items-center gap-2"><BarChart2 size={20} /> Inventory Report</h2>
      <button onClick={loadInventoryReport} className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-black transition"><RefreshCw size={13} /> Load / Refresh</button>
    </div>
    {inventoryLoading && <div className="py-12 text-center text-gray-400">Loading inventory data...</div>}
    {inventoryReport && (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: inventoryReport.summary.totalProducts, color: 'bg-blue-50 border-blue-200 text-blue-800' },
            { label: 'Total Stock Units', value: inventoryReport.summary.totalStockUnits.toLocaleString('en-IN'), color: 'bg-green-50 border-green-200 text-green-800' },
            { label: 'Stock Value', value: `₹${inventoryReport.summary.totalStockValue.toLocaleString('en-IN')}`, color: 'bg-purple-50 border-purple-200 text-purple-800' },
            { label: 'Missing SKUs', value: inventoryReport.summary.missingSkuCount, color: 'bg-orange-50 border-orange-200 text-orange-800' },
          ].map(card => (
            <div key={card.label} className={`rounded-xl border p-4 ${card.color}`}>
              <p className="text-[11px] font-black uppercase tracking-widest opacity-70">{card.label}</p>
              <p className="text-2xl font-black mt-1">{card.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <CheckCircle2 size={20} className="mx-auto text-green-600 mb-1" />
            <p className="text-xs font-bold text-green-700 uppercase">In Stock</p>
            <p className="text-2xl font-black text-green-800">{inventoryReport.summary.inStockCount}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <AlertTriangle size={20} className="mx-auto text-yellow-600 mb-1" />
            <p className="text-xs font-bold text-yellow-700 uppercase">Low Stock</p>
            <p className="text-2xl font-black text-yellow-800">{inventoryReport.summary.lowStockCount}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <XCircle size={20} className="mx-auto text-red-600 mb-1" />
            <p className="text-xs font-bold text-red-700 uppercase">Out of Stock</p>
            <p className="text-2xl font-black text-red-800">{inventoryReport.summary.outOfStockCount}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'lowStock', 'outOfStock'].map(f => (
            <button key={f} onClick={() => setInventoryFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${inventoryFilter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f === 'all' ? 'All Alerts' : f === 'lowStock' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
        {inventoryFilter !== 'outOfStock' && inventoryReport.lowStock.length > 0 && (
          <div className="bg-white rounded-2xl border border-yellow-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-yellow-50 border-b border-yellow-100"><p className="text-xs font-black uppercase text-yellow-700 tracking-widest">Low Stock Products</p></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>{['Product', 'SKU', 'Category', 'Stock', 'Threshold', 'Price'].map(h => <th key={h} className="px-4 py-2 text-left text-[10px] font-black text-gray-500 uppercase">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {inventoryReport.lowStock.map(p => (
                    <tr key={p._id} className="hover:bg-yellow-50 transition">
                      <td className="px-4 py-3 flex items-center gap-2">{p.image && <img src={p.image} alt="" className="w-8 h-10 object-cover rounded" />}<span className="font-semibold text-sm">{p.name}</span></td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku || '—'}</td>
                      <td className="px-4 py-3 text-xs">{p.category}</td>
                      <td className="px-4 py-3"><span className="bg-yellow-100 text-yellow-800 font-black text-xs px-2 py-1 rounded-full">{p.stock}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{p.lowStockThreshold}</td>
                      <td className="px-4 py-3 text-xs font-bold">₹{p.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {inventoryFilter !== 'lowStock' && inventoryReport.outOfStock.length > 0 && (
          <div className="bg-white rounded-2xl border border-red-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-red-50 border-b border-red-100"><p className="text-xs font-black uppercase text-red-700 tracking-widest">Out of Stock Products</p></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>{['Product', 'SKU', 'Category', 'Price', 'Active'].map(h => <th key={h} className="px-4 py-2 text-left text-[10px] font-black text-gray-500 uppercase">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {inventoryReport.outOfStock.map(p => (
                    <tr key={p._id} className="hover:bg-red-50 transition">
                      <td className="px-4 py-3 flex items-center gap-2">{p.image && <img src={p.image} alt="" className="w-8 h-10 object-cover rounded" />}<span className="font-semibold">{p.name}</span></td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku || '—'}</td>
                      <td className="px-4 py-3 text-xs">{p.category}</td>
                      <td className="px-4 py-3 text-xs font-bold">₹{p.price}</td>
                      <td className="px-4 py-3"><span className={`text-[10px] font-black px-2 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.isActive ? 'Active' : 'Hidden'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100"><p className="text-xs font-black uppercase text-gray-600 tracking-widest">Category Breakdown</p></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>{['Category', 'Products', 'Total Units', 'Stock Value'].map(h => <th key={h} className="px-4 py-2 text-left text-[10px] font-black text-gray-500 uppercase">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {inventoryReport.categoryBreakdown.map(cat => (
                  <tr key={cat.category} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-semibold">{cat.category}</td>
                    <td className="px-4 py-3 text-xs">{cat.count}</td>
                    <td className="px-4 py-3 text-xs">{cat.totalStock.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-xs font-bold">₹{cat.totalValue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Bulk Tools Tab
// ─────────────────────────────────────────────────────────────────────────────
export const BulkToolsTab = ({ exportLoading, exportProductsCSV, downloadCsvTemplate, parseCsvImport, csvImportRows, setCsvImportRows, csvImportLoading, submitCsvImport, csvImportResult }) => (
  <div className="space-y-8">
    <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 flex items-center gap-2"><Package size={20} /> Bulk Import / Export</h2>
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-100 rounded-full p-2"><Download size={18} className="text-green-700" /></div>
        <div><h3 className="font-black text-base uppercase">Export Products</h3><p className="text-sm text-gray-500">Download all products as a CSV file</p></div>
      </div>
      <button onClick={exportProductsCSV} disabled={exportLoading} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition disabled:opacity-60">
        <Download size={16} />{exportLoading ? 'Exporting...' : 'Export All Products as CSV'}
      </button>
      <p className="text-xs text-gray-400 mt-2">Includes: name, SKU, barcode, category, price, stock, sizes, colors, and 20+ more fields.</p>
    </div>
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 rounded-full p-2"><FileUp size={18} className="text-blue-700" /></div>
        <div><h3 className="font-black text-base uppercase">Import Products from CSV</h3><p className="text-sm text-gray-500">Upload a CSV file to bulk-create products</p></div>
        <button onClick={downloadCsvTemplate} className="ml-auto flex items-center gap-1.5 text-blue-600 border border-blue-300 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition"><Download size={13} /> Download Template</button>
      </div>
      <input type="file" accept=".csv" onChange={parseCsvImport} className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-900 file:text-white hover:file:bg-black transition mb-4" />
      {csvImportRows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">{csvImportRows.length} rows detected — Preview (first 5):</p>
            <button onClick={() => setCsvImportRows([])} className="text-xs text-gray-400 hover:text-red-500 transition">Clear</button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-900 text-white"><tr>{['Name', 'Category', 'Brand', 'Price', 'Stock', 'SKU'].map(h => <th key={h} className="px-3 py-2 text-left font-black uppercase tracking-wider">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {csvImportRows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-semibold">{row.name}</td>
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2">{row.brand}</td>
                    <td className="px-3 py-2">₹{row.price}</td>
                    <td className="px-3 py-2">{row.stock}</td>
                    <td className="px-3 py-2 font-mono">{row.sku || '(auto)'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={submitCsvImport} disabled={csvImportLoading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition disabled:opacity-60">
            <FileUp size={16} />{csvImportLoading ? 'Importing...' : `Import ${csvImportRows.length} Products`}
          </button>
          {csvImportResult && <div className="bg-green-50 border border-green-200 rounded-xl p-4"><p className="text-green-700 font-bold text-sm">✅ {csvImportResult.message}</p></div>}
        </div>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SKU & Barcodes Tab
// ─────────────────────────────────────────────────────────────────────────────
export const SkuBarcodesTab = ({ skuGenLoading, handleGenerateAllSkus, skuGenResult, inventoryReport, loadInventoryReport }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 flex items-center gap-2"><Barcode size={20} /> SKU & Barcode Management</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 rounded-full p-2"><Zap size={18} className="text-purple-700" /></div>
          <div><h3 className="font-black text-base uppercase">Auto-Generate SKUs</h3><p className="text-sm text-gray-500">Generate SKUs for all products missing one</p></div>
        </div>
        <p className="text-xs text-gray-400 mb-4">Format: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">CAT-BRD-XXXXX</span> e.g. KUR-CEL-A3F7B</p>
        <button onClick={handleGenerateAllSkus} disabled={skuGenLoading} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition disabled:opacity-60 w-full justify-center">
          <Zap size={16} />{skuGenLoading ? 'Generating...' : 'Generate Missing SKUs'}
        </button>
        {skuGenResult && <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4"><p className="text-green-700 font-bold text-sm">✅ {skuGenResult.message}</p></div>}
      </div>
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
        <h3 className="font-black text-sm uppercase tracking-widest text-gray-600 mb-3">SKU Format Guide</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3"><div className="bg-gray-900 text-white rounded px-2 py-1 font-mono text-xs shrink-0">CAT</div><p className="text-gray-600 text-xs pt-1">First 3 chars of product category (e.g. KUR for Kurtis, COO for Co-ord Sets)</p></div>
          <div className="flex items-start gap-3"><div className="bg-gray-900 text-white rounded px-2 py-1 font-mono text-xs shrink-0">BRD</div><p className="text-gray-600 text-xs pt-1">First 3 chars of brand name (e.g. CEL for Celina)</p></div>
          <div className="flex items-start gap-3"><div className="bg-gray-900 text-white rounded px-2 py-1 font-mono text-xs shrink-0">XXXXX</div><p className="text-gray-600 text-xs pt-1">5-character random alphanumeric suffix for uniqueness</p></div>
        </div>
        <div className="mt-4 p-3 bg-gray-900 rounded-xl">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Example SKUs</p>
          <p className="font-mono text-white text-sm">KUR-CEL-A3F7B</p>
          <p className="font-mono text-white text-sm">COO-CEL-X9P2K</p>
          <p className="font-mono text-white text-sm">BOT-CEL-M4Q1Z</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-black uppercase text-gray-600 tracking-widest">Products with SKU &amp; Barcode</p>
        <button onClick={loadInventoryReport} className="text-xs font-bold text-blue-600 hover:underline">Load / Refresh</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 text-white"><tr>{['Product', 'SKU', 'Barcode', 'Category', 'Brand', 'Stock'].map(h => <th key={h} className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100">
            {inventoryReport ? [...(inventoryReport.lowStock || []), ...(inventoryReport.outOfStock || [])].slice(0, 20).map(p => (
              <tr key={p._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-semibold text-sm">{p.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.sku || <span className="text-red-500 italic">Missing</span>}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku || '—'}</td>
                <td className="px-4 py-3 text-xs">{p.category}</td>
                <td className="px-4 py-3 text-xs">{p.brand}</td>
                <td className="px-4 py-3 text-xs">{p.stock}</td>
              </tr>
            )) : <tr><td colSpan="6" className="py-8 text-center text-gray-400 italic text-sm">Click "Load / Refresh" to view SKU data.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Store Credit Tab
// ─────────────────────────────────────────────────────────────────────────────
export const StoreCreditTab = ({ storeCreditStats, storeCreditLoading, loadStoreCreditStats, manualCreditForm, setManualCreditForm, issueManualCredit }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 flex items-center gap-2"><Wallet size={20} /> Store Credit Management</h2>
      <button onClick={loadStoreCreditStats} className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-black transition"><RefreshCw size={13} /> Load Stats</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {storeCreditStats ? (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-1">Total Outstanding Credit</p>
          <p className="text-4xl font-black">₹{storeCreditStats.totalOutstanding.toLocaleString('en-IN')}</p>
          <p className="text-sm text-white/60 mt-2">{storeCreditStats.usersWithCredit} customers have active store credit</p>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center justify-center text-gray-400 text-sm italic">
          {storeCreditLoading ? 'Loading...' : 'Click "Load Stats" to view store credit data'}
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-black text-base uppercase mb-4">Issue Store Credit Manually</h3>
        <div className="space-y-3">
          <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">User ID (MongoDB _id)</label><input value={manualCreditForm.userId} onChange={e => setManualCreditForm(f => ({ ...f, userId: e.target.value }))} className="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900" placeholder="64abc123..." /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Amount (₹)</label><input type="number" value={manualCreditForm.amount} onChange={e => setManualCreditForm(f => ({ ...f, amount: e.target.value }))} className="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900" placeholder="100" /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Reason</label><input value={manualCreditForm.reason} onChange={e => setManualCreditForm(f => ({ ...f, reason: e.target.value }))} className="w-full border border-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900" placeholder="Goodwill credit / compensation..." /></div>
          <button onClick={issueManualCredit} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition flex items-center justify-center gap-2"><Wallet size={15} /> Issue Store Credit</button>
        </div>
      </div>
    </div>
    {storeCreditStats && storeCreditStats.users.length > 0 && (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100"><p className="text-xs font-black uppercase text-gray-600 tracking-widest">Customers with Store Credit</p></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-white"><tr>{['Customer', 'Email', 'Balance', 'Transactions'].map(h => <th key={h} className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-100">
              {storeCreditStats.users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                  <td className="px-4 py-3"><span className="bg-green-100 text-green-800 font-black text-sm px-3 py-1 rounded-full">₹{u.storeCredit}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.storeCreditHistory?.length || 0} txn(s)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);
