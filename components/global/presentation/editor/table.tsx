"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useSlideStore } from "@/store/use-slide-store"
import { cn } from "@/lib/utils"
import React, { useState } from "react"

interface TableProps {
  content: string[][]
  onChange: (newContent: string[][]) => void
  isPreview?: boolean
  isEditable?: boolean
  isSidebar?: boolean
  initialRowSize?: number
  initialColSize?: number
}

const Table = ({
  content,
  isEditable = true,
  isPreview = false,
  isSidebar = false,
  onChange,
  initialColSize = 3,
  initialRowSize = 3,
}: TableProps) => {
  const { currentTheme } = useSlideStore()

  const [tableData, setTableData] = useState<string[][]>(() => {
    if (!content?.length || !content[0]?.length) {
      return Array(initialRowSize)
        .fill(null)
        .map(() => Array(initialColSize).fill(""))
    }
    return content
  })

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    if (!isEditable) return
    const newData = tableData.map((row, rIndex) =>
      rIndex === rowIndex
        ? row.map((cell, cIndex) => (cIndex === colIndex ? value : cell))
        : row
    )
    setTableData(newData)
  }

  // 🪄 Preview / Sidebar Compact Table
  if (isPreview || isSidebar) {
    return (
      <div
        className={cn(
          "w-full max-w-full overflow-x-auto",
          isSidebar ? "text-[0.7rem] leading-tight" : "text-xs"
        )}
      >
        <table
          className={cn(
            "w-full table-fixed border border-gray-300 text-left",
            isSidebar ? "" : "rounded-lg shadow-md"
          )}
        >
          <thead className="bg-gray-100">
            <tr>
              {tableData[0]?.map((cell, index) => (
                <th
                  key={index}
                  className={cn(
                    "truncate border font-medium text-gray-700",
                    isSidebar ? "p-1" : "p-2"
                  )}
                  style={{
                    width: `${100 / tableData[0].length}%`,
                    minWidth: isSidebar ? "48px" : undefined,
                    maxWidth: isSidebar ? "100px" : undefined,
                  }}
                >
                  {cell || "—"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      "border align-top wrap-break-word text-gray-800",
                      isSidebar ? "p-1" : "p-2"
                    )}
                  >
                    {cell || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // 🧑‍💻 Main Editor Resizable Table
  return (
    <div
      className="relative h-full w-full rounded-xl shadow-lg backdrop-blur-md"
      style={{
        background:
          currentTheme.gradientBackground || currentTheme.backgroundColor,
        borderRadius: "12px",
        boxShadow: `0 4px 30px ${currentTheme.accentColor}55`,
      }}
    >
      <ResizablePanelGroup
        orientation="vertical"
        className={cn(
          "h-full w-full overflow-hidden rounded-lg border border-gray-300/50",
          initialColSize === 2
            ? "min-h-25"
            : initialColSize === 3
              ? "min-h-37.5"
              : initialColSize === 4
                ? "min-h-50"
                : "min-h-25"
        )}
      >
        {tableData.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {rowIndex > 0 && (
              <ResizableHandle className="bg-gray-300/30 hover:bg-blue-400/50" />
            )}
            <ResizablePanel defaultSize={100 / tableData.length}>
              <ResizablePanelGroup
                orientation="horizontal"
                className="h-full w-full"
              >
                {row.map((cell, colIndex) => (
                  <React.Fragment key={colIndex}>
                    {colIndex > 0 && (
                      <ResizableHandle className="bg-gray-300/30 hover:bg-blue-400/50" />
                    )}
                    <ResizablePanel
                      defaultSize={100 / row.length}
                      className="h-full min-h-9 w-full transition-all duration-300 hover:scale-[1.01]"
                    >
                      <div className="relative h-full w-full">
                        <input
                          value={cell}
                          onChange={(e) =>
                            updateCell(rowIndex, colIndex, e.target.value)
                          }
                          onBlur={() => onChange(tableData)}
                          className="h-full w-full rounded-md border border-white/20 bg-white/20 p-3 text-sm backdrop-blur-xl placeholder:text-gray-400 placeholder:italic focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          style={{
                            color: currentTheme.fontColor,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                          placeholder="Type here"
                          readOnly={!isEditable}
                        />
                      </div>
                    </ResizablePanel>
                  </React.Fragment>
                ))}
              </ResizablePanelGroup>
            </ResizablePanel>
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  )
}

export default Table
