'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  useSubmissionsActions,
  useShowSaveDialog,
  useGuidelineName,
} from '@/lib/store';
import React from 'react';

export function SaveGuidelineDialog() {
  const {
    updateGuidelineName,
    closeSaveDialog,
    addGuideline,
    clearGuidelineName,
  } = useSubmissionsActions();
  const showSaveDialog = useShowSaveDialog();
  const guidelineName = useGuidelineName();
  const [currentGuidelineText, setCurrentGuidelineText] = React.useState('');

  React.useEffect(() => {
    if (showSaveDialog) {
      const guidelineTextarea = document.getElementById(
        'guideline',
      ) as HTMLTextAreaElement;
      if (guidelineTextarea) {
        setCurrentGuidelineText(guidelineTextarea.value);
      }
    }
  }, [showSaveDialog]);

  const handleSave = async () => {
    if (guidelineName.trim() && currentGuidelineText.trim()) {
      await addGuideline(guidelineName.trim(), currentGuidelineText.trim());
      clearGuidelineName();
      closeSaveDialog();
    }
  };

  const handleClose = () => {
    clearGuidelineName();
    closeSaveDialog();
  };

  return (
    <Dialog open={showSaveDialog} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Guideline</DialogTitle>
          <DialogDescription>
            Give this guideline a name so you can reuse it later
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="guideline-name">Guideline Name</Label>
            <Input
              id="guideline-name"
              placeholder="e.g., Ticket Closure Policy"
              value={guidelineName}
              onChange={(e) => updateGuidelineName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Guideline Text</Label>
            <p className="text-sm bg-muted p-3 rounded-md max-h-32 overflow-y-auto">
              {currentGuidelineText || 'No guideline text'}
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!guidelineName.trim() || !currentGuidelineText.trim()}
            >
              Save Guideline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
