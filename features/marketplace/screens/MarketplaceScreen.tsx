import { DUMMY_PRODUCTS } from "@/features/marketplace/data/dummyProducts";
import { lazy, useState } from "react";
import useDepartments from "../hooks/useDepartments";
import useProductFilters from "../hooks/useProductFilters";
import DepartmentsSection from "../ui/DepartmentsSection";
import FeaturedProductsSection from "../ui/FeaturedProductsSection";
import Header from "../ui/header/Header";
import {
  ContentContainer,
  OuterContainer,
  ScrollContainer,
} from "../ui/layout/Container";

const ProductFiltersSheet = lazy(() => import("../ui/ProductFiltersSheet"));

export default function MarketplaceScreen() {
  const { departments, loading } = useDepartments();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const {
    filters,
    applyFilters,
    filteredCount,
    paginated,
    page,
    totalPages,
    itemsPerPage,
    changeItemsPerPage,
    goToPage,
  } = useProductFilters(DUMMY_PRODUCTS);

  const wallpaperImage = require("@/assets/images/wallpaper-1.jpg");

  return (
    <OuterContainer enableBottomInset>
      <ScrollContainer>
        <Header wallpaperImage={wallpaperImage} />
        <ContentContainer>
          {/* ── Departments from DB ────────────────────────────────────── */}
          <DepartmentsSection
            departments={departments}
            loading={loading}
            setFiltersVisible={setFiltersVisible}
          />

          {/* ── Featured products ──────────────────────────────────── */}
          <FeaturedProductsSection
            products={paginated}
            filteredCount={filteredCount}
            page={page}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onGoToPage={goToPage}
            onChangeItemsPerPage={changeItemsPerPage}
          />
        </ContentContainer>
      </ScrollContainer>

      <ProductFiltersSheet
        visible={filtersVisible}
        initialFilters={filters}
        onApply={applyFilters}
        onClose={() => setFiltersVisible(false)}
      />
    </OuterContainer>
  );
}
