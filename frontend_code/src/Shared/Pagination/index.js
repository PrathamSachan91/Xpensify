import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IconButton } from "@mui/material";

const CustomToPagination = ({ setPage, page, data }) => {
  const totalPages = data?.totalPage || 1;
  const currentPage = data?.currPage || 1;

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 rounded mt-4">
      <div className="flex items-center gap-2">
        <IconButton
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`transition-transform duration-200 rounded-full ${page <= 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-110"
            }`}
        >
          <ChevronLeftIcon className="text-black dark:text-gray-100" />
        </IconButton>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base">
          <span className="font-semibold text-dark-color">
            <span className="text-black dark:text-gray-100">{currentPage}/{totalPages}</span>
          </span>
        </div>
        <IconButton
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className={`transition-transform duration-200 rounded-full ${page >= totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-110"
            }`}
        >
          <ChevronRightIcon className="text-black dark:text-gray-100" />
        </IconButton>
      </div>
    </div>
  );
};

export default CustomToPagination;
