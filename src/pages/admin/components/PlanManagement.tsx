
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import { PlanTable } from "./plan/PlanTable";
import { PlanFormDialog } from "./plan/PlanFormDialog";
import { usePlanManagement } from "../hooks/usePlanManagement";

export const PlanManagement = () => {
  const {
    plans,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    editingPlan,
    formData,
    handleInputChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSubmit
  } = usePlanManagement();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payment Plans</CardTitle>
            <CardDescription>Manage subscription plans</CardDescription>
          </div>
          <Button onClick={handleAdd} size="sm">
            <Plus size={16} className="mr-2" />
            Add Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <PlanTable
          plans={plans}
          loading={loading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />

        <PlanFormDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isEditing={!!editingPlan}
        />
      </CardContent>
    </Card>
  );
};
