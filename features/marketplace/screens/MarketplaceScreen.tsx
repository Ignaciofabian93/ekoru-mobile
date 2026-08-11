import { useState } from "react";

import useDepartments from "../hooks/useDepartments";
import useProductFilters from "../hooks/useProductFilters";
import useProducts from "../hooks/useProducts";
import DepartmentsSection from "../ui/DepartmentsSection";
import FeaturedProductsSection from "../ui/FeaturedProductsSection";
import Header from "../ui/header/Header";
import {
  ContentContainer,
  OuterContainer,
  ScrollContainer,
} from "../ui/layout/Container";
import ProductFiltersSheet from "../ui/ProductFiltersSheet";

export default function MarketplaceScreen() {
  const { departments, loading: departmentsLoading } = useDepartments();
  const fp = useProductFilters();
  const { products, pageInfo } = useProducts({
    page: fp.page,
    pageSize: fp.pageSize,
    filter: fp.filterInput,
    sort: fp.sortInput,
  });
  const [filtersVisible, setFiltersVisible] = useState(false);

  const wallpaperImage = require("@/assets/images/wallpaper-1.jpg");

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        <Header wallpaperImage={wallpaperImage} />
        <ContentContainer>
          {/* ── Departments from DB ────────────────────────────────── */}
          <DepartmentsSection
            departments={departments}
            loading={departmentsLoading}
            setFiltersVisible={setFiltersVisible}
          />

          {/* ── Featured products (live) ───────────────────────────── */}
          <FeaturedProductsSection
            products={products}
            filteredCount={pageInfo?.totalCount ?? products.length}
            page={pageInfo?.currentPage ?? 1}
            totalPages={pageInfo?.totalPages ?? 1}
            itemsPerPage={fp.pageSize}
            onGoToPage={fp.setPage}
            onChangeItemsPerPage={fp.setPageSize}
          />
        </ContentContainer>
      </ScrollContainer>

      <ProductFiltersSheet
        visible={filtersVisible}
        initialFilters={fp.filters}
        onApply={fp.applyFilters}
        onClose={() => setFiltersVisible(false)}
      />
    </OuterContainer>
  );
}
