// src/lib/types.ts
export interface HoleDataPayload {
    tool?: string;
    'X Offset'?: number;
    'Y Offset'?: number;
    holeDepth?: number;
    recipeNum?: number;
    process?: string;
    robot?: string;
    feedRate?: number;
    spindleSpeed?: number;
  }
  
  export interface HoleDataModel {
    id: number;
    timestamp: Date;
    userId: number;
    cellId: number;
    recipeId: number;
    feedRate: number;
    spindleSpeed: number;
  }
  
  export interface ToolDataModel {
    id: number;
    name: string;
    diameter: number;
    length: number;
    numberOfUses: number;
    inspectionFrequency: number;
  }
  
  export interface SSEPayload {
    toolName: string | null;
    xOffset?: number;
    yOffset?: number;
    depth?: number;
    recipeNum?: number;
    process?: string;
    robot?: string;
    feedRate: number;
    spindleSpeed: number;
    timestamp: number;
  }